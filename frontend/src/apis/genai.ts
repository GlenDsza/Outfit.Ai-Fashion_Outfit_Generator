import axios from "axios";
import Txt2ImgSampleResponse from "./samples/txt2img.json";
import OutfitResponse from "./samples/generativeOutfitsResponse.json";
import RecommendedProductsResponse from "./samples/recommendedproductsResponse.json";
import { LLM_API_URL, SD_API_URL } from "../constants/urls.ts";
import { NEGATIVE_PROMPT_BODY, STEPS } from "../constants/prompting.ts";

// function base64ToImgURL(base64String: string) {
//   const blob = new Blob(["data:image/png;base64," + base64String], {
//     type: "image/png",
//   });
//   return URL.createObjectURL(blob);
// }

export async function getOutfitPrompts(prompt: string, newChat: boolean) {
  // Test response
  // await Promise.resolve(new Promise(resolve => setTimeout(resolve, 300)));
  // const response = OutfitResponse;
  const response: {
    product_ids: Record<string, string>;
    article_ids: Record<string, string>;
    products_data: any[];
    answer: string;
    outfit_descriptions: string[];
  } = await axios
    .post(`${LLM_API_URL}/generativeOutfits`, {
      prompt: `${prompt} for ${localStorage.getItem(
        "gender"
      )} aged ${localStorage.getItem("age")} `,
      new: newChat,
    })
    .then((res) => res.data);

  console.log("Outfit prompts", response);
  return {
    outfit_descriptions: response.outfit_descriptions || [],
    answer: response.answer,
  };
}

export async function getLlmRecommendations(prompt: string, newChat: boolean) {
  // Test response
  // await Promise.resolve(new Promise((resolve) => setTimeout(resolve, 300)));
  // const response = RecommendedProductsResponse;

  const response: {
    product_ids: Record<string, string>;
    article_ids: Record<string, string>;
    products_data: any[];
    answer: string;
  } = await axios
    .post(`${LLM_API_URL}/recommendedproducts`, {
      new: newChat,
      prompt: `${prompt} for ${localStorage.getItem(
        "gender"
      )} aged ${localStorage.getItem("age")} `,
    })
    .then((res) => res.data);

  console.log("LLM recommends", response);
  return {
    answer: response.answer,
    articles: Object.values(response.article_ids) || [],
  };
}

function sdNegativePromptGenerator() {
  return NEGATIVE_PROMPT_BODY;
}
function finalSdPromptGenerator(userPrompt, rawOutfitPrompt) {
  const prefix =
    "8k uhd, dslr, soft lighting, high quality, film grain, full frame, Fujifilm XT3 ";
  const str = ` for ${localStorage.getItem(
    "gender"
  )} aged ${localStorage.getItem("age")}`;

  const body = `full portrait photo ${userPrompt} ${str} wearing ${rawOutfitPrompt} <lora:add_detail:1> `;
  const postfix = "";
  return prefix + body + postfix;
}

export async function generateOutfit(
  userMessage: string,
  prompt: string,
  desc: string
) {
  const finalSdPrompt = finalSdPromptGenerator(userMessage, prompt);
  const finalSdNegativePrompt = sdNegativePromptGenerator();

  console.log(`Generating ${desc} with prompt: ${finalSdPrompt}`, {
    finalSdNegativePrompt,
    finalSdPrompt,
  });

  // Test response
  // await Promise.resolve(new Promise((resolve) => setTimeout(resolve, 300)));
  // const response = Txt2ImgSampleResponse;
  const response: {
    images: string[];
    parameters: Record<string, any>;
    info: string;
  } = await axios
    .post(`${SD_API_URL}/sdapi/v1/txt2img`, {
      prompt: finalSdPrompt,
      negative_prompt: sdNegativePromptGenerator(),
      steps: STEPS,
    })
    .then((res) => res.data);

  const generatedRawImages = response.images;
  const generatedImage = {
    desc,
    imageString: generatedRawImages[0],
    // imageString: base64ToImgURL(generatedRawImages[0]),
  };
  return generatedImage;
}
