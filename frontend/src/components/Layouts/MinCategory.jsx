import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";
import { categories } from "../../utils/constants";

const MinCategory = ({ setCategory }) => {
  return (
    <section className="hidden sm:block bg-white w-full px-2 sm:px-12 overflow-hidden border-b mt-14">
      <div className="flex items-center justify-between p-0.5">
        {categories.map((el, i) => (
          <Link
            to={`/products?category=${
              el === "Men's Fashion"
                ? "Menswear"
                : el === "Women's Fashion"
                ? "Ladieswear"
                : el === "Unisex Fashion"
                ? "General"
                : el === "Kid's Fashion"
                ? "Baby/Children"
                : el
            }`}
            key={i}
            onClick={() =>
              setCategory(
                `${
                  el === "Men's Fashion"
                    ? "Menswear"
                    : el === "Women's Fashion"
                    ? "Ladieswear"
                    : el === "Unisex Fashion"
                    ? "General"
                    : el === "Kid's Fashion"
                    ? "Baby/Children"
                    : el
                }`
              )
            }
            className="text-sm p-2 text-gray-800 font-medium hover:text-primary-blue flex items-center gap-0.5 group"
          >
            {el}{" "}
            <span className="text-gray-400 group-hover:text-primary-blue">
              <ExpandMoreIcon sx={{ fontSize: "16px" }} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default MinCategory;
