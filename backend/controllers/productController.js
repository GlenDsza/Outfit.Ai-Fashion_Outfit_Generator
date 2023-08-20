const cloudinary = require("cloudinary");

const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const SearchFeatures = require("../utils/searchFeatures");
const ErrorHandler = require("../utils/errorHandler");

const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

// Get All Products
exports.getAllProducts = asyncErrorHandler(async (req, res, next) => {
  const resultPerPage = 12;
  const productsCount = await Product.countDocuments();
  // console.log(req.query);

  const searchFeature = new SearchFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await searchFeature.query;
  let filteredProductsCount = products.length;

  searchFeature.pagination(resultPerPage);

  products = await searchFeature.query.clone();

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

// Get All Products ---Product Sliders
exports.getProducts = asyncErrorHandler(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

// Get Product Details
exports.getProductDetails = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

exports.getProductByAid = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findOne({ article_id: req.params.id });

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Increment product impression
exports.addProductImpression = asyncErrorHandler(async (req, res, next) => {
  const productId = req.params.id;
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var updatedProduct = await Product.findOneAndUpdate(
    { _id: productId, "impressions.date": today },
    { $inc: { "impressions.$.count": 1 } },
    { new: true }
  );

  if (!updatedProduct) {
    // If there is no entry for today, create a new one
    updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $push: { impressions: { date: today, count: 1 } },
      },
      { new: true }
    );
  }
  if (!updatedProduct) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  res.status(200).json({
    success: true,
    updatedProduct,
  });
});

// Get All Products ---ADMIN
exports.getAdminProducts = asyncErrorHandler(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

// Create Product ---ADMIN
exports.createProduct = asyncErrorHandler(async (req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLink = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLink.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  const result = await cloudinary.v2.uploader.upload(req.body.logo, {
    folder: "brands",
  });
  const brandLogo = {
    public_id: result.public_id,
    url: result.secure_url,
  };

  req.body.brand = {
    name: req.body.brandname,
    logo: brandLogo,
  };
  req.body.images = imagesLink;
  req.body.user = req.user.id;

  let specs = [];
  req.body.specifications.forEach((s) => {
    specs.push(JSON.parse(s));
  });
  req.body.specifications = specs;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Update Product ---ADMIN
exports.updateProduct = asyncErrorHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  if (req.body.images !== undefined) {
    let images = [];
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLink = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLink.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    req.body.images = imagesLink;
  }

  if (req.body.logo.length > 0) {
    await cloudinary.v2.uploader.destroy(product.brand.logo.public_id);
    const result = await cloudinary.v2.uploader.upload(req.body.logo, {
      folder: "brands",
    });
    const brandLogo = {
      public_id: result.public_id,
      url: result.secure_url,
    };

    req.body.brand = {
      name: req.body.brandname,
      logo: brandLogo,
    };
  }

  let specs = [];
  req.body.specifications.forEach((s) => {
    specs.push(JSON.parse(s));
  });
  req.body.specifications = specs;
  req.body.user = req.user.id;

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(201).json({
    success: true,
    product,
  });
});

// Delete Product ---ADMIN
exports.deleteProduct = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await product.remove();

  res.status(201).json({
    success: true,
  });
});

// Create OR Update Reviews
exports.createProductReview = asyncErrorHandler(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  const isReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of Product
exports.getProductReviews = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Reveiws
exports.deleteReview = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings: Number(ratings),
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

exports.getTrendingProducts = asyncErrorHandler(async (req, res, next) => {
  try {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    // Aggregate orders based on purchases in the last 7 days
    const trendingProducts = await Order.aggregate([
      {
        $match: {
          paidAt: { $gte: lastWeek },
        },
      },
      {
        $group: {
          _id: "$product.article_id",
          totalPurchases: { $sum: "$product.quantity" },
        },
      },
      {
        $sort: { totalPurchases: -1 },
      },
    ]);

    // Map the trending product IDs
    const trendingProductIds = trendingProducts.map((product) => product._id);

    // Group trending products by category and limit to 12 products per category
    const trendingProductsByCategory = await Product.aggregate([
      {
        $match: {
          article_id: { $in: trendingProductIds },
        },
      },
      {
        $group: {
          _id: "$category",
          products: {
            $push: {
              info: "$$ROOT",
              totalPurchases: {
                $sum: {
                  $cond: [
                    {
                      $in: ["$$ROOT.article_id", trendingProductIds],
                    },
                    "$$ROOT.stock", // Count the stock of the trending product
                    0, // Don't count if not trending
                  ],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          category: "$_id",
          products: {
            $slice: ["$products", 12], // Limit each category to 12 products
          },
          _id: 0,
        },
      },
    ]);
    console.log(trendingProductsByCategory);
    res.status(200).json({
      success: true,
      trendingProducts: trendingProductsByCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

exports.addToWishlist = asyncErrorHandler(async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (!user.wishlist.some((item) => item.article_id == product.article_id)) {
      user.wishlist.push({ article_id: product.article_id });
      await user.save();
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

exports.addToCart = asyncErrorHandler(async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (!user.cart.some((item) => item?.article_id == product.article_id)) {
      user.cart.push({ article_id: product.article_id });
      await user.save();
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
