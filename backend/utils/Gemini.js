
import "dotenv/config";

const models = [
  "gemini-3.5-flash",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
];

const apiKeys = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
];

const getGeminiAPIResponse = async (message) => {

  // First loop -> API Keys
  for (let keyIndex = 0; keyIndex < apiKeys.length; keyIndex++) {

    const apiKey = apiKeys[keyIndex];

    // Second loop -> Models
    for (const model of models) {

      const url =
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }],
            },
          ],
        }),
      };

      try {

        console.log(
          `Trying API Key ${keyIndex + 1} with model ${model}`
        );

        const response = await fetch(url, options);

        const data = await response.json();

        // If API returns error
        if (!response.ok) {

          console.error(
            `API Key ${keyIndex + 1} failed with ${model}. Status: ${response.status}`
          );

          console.error(data);

          // Try next model
          continue;
        }

        // Extract response
        const text =
          data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {

          console.error(
            `No valid response from API Key ${keyIndex + 1} using ${model}`
          );

          // Try next model
          continue;
        }

        // SUCCESS
        console.log(
          `Success using API Key ${keyIndex + 1} with ${model}`
        );

        return text;

      } catch (err) {

        console.error(
          `Fetch error with API Key ${keyIndex + 1} and ${model}:`,
          err.message
        );

        // Try next model
        continue;
      }
    }

    // If execution reaches here,
    // ALL models failed for this API key

    console.log(
      `All models failed for API Key ${keyIndex + 1}. Switching API key...`
    );
  }

  // If execution reaches here,
  // ALL models + ALL API keys failed

  throw new Error(
    "All Gemini API keys and models failed"
  );
};

export default getGeminiAPIResponse;




// import "dotenv/config";

// const getGeminiAPIResponse = async(message)=>{
//      const model = "gemini-3.5-flash";
//     const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
//     const options = {
//         method:"POST",
//         headers:{
//           "Content-Type": "application/json",
//             // 2. Correct authentication header format
//             "x-goog-api-key": process.env.GEMINI_API_KEY
//         }, 
//         body: JSON.stringify({
//             contents: [
//                 {
//                     role: "user",
//                     parts: [{ text:message }]
//                 }
//             ]
//         })
//     };
//     try {
//        const response = await fetch(url, options);
//        const data = await response.json();
       
//        //console.log(data.candidates[0].content.parts[0].text);
//        console.log(data);
//        return data.candidates[0].content.parts[0].text;
//     } catch (err) {
//         console.error("Fetch Error:", err);
//         res.status(500).send({ error: "Failed to communicate with Gemini API" });
//     }
// }



// // const ai = new GoogleGenAI({
// //   apiKey: process.env.GEMINI_API_KEY,
// // });

// // const response = await ai.models.generateContent({
// //   model: "gemini-2.5-flash",
// //   contents: "difference between sql and mongodb",
// // });

// // console.log(response.text);


// export default getGeminiAPIResponse;