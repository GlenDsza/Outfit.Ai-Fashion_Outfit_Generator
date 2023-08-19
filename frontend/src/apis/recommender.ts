import RecommenderResponse from "./samples/recommender.json";

export async function recommender(cid: string) {
  await Promise.resolve(new Promise(resolve => setTimeout(resolve, 300)));
  const response = RecommenderResponse
  // console.log(prompt);
  
  // const response: {
  // } = await axios.post(``, {
  //   cid,
  // }).then(res => res.data);
  console.log("Recommender:", response);
  return {};
}