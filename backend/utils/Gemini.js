import "dotenv/config";

const getGeminiAPIResponse = async(message)=>{
     const model = "gemini-3.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const options = {
        method:"POST",
        headers:{
          "Content-Type": "application/json",
            // 2. Correct authentication header format
            "x-goog-api-key": process.env.GEMINI_API_KEY
        }, 
        body: JSON.stringify({
            contents: [
                {
                    role: "user",
                    parts: [{ text:message }]
                }
            ]
        })
    };
    try {
       const response = await fetch(url, options);
       const data = await response.json();
       
       //console.log(data.candidates[0].content.parts[0].text);
       console.log(data);
       return data.candidates[0].content.parts[0].text;
    } catch (err) {
        console.error("Fetch Error:", err);
        res.status(500).send({ error: "Failed to communicate with Gemini API" });
    }
}



// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// const response = await ai.models.generateContent({
//   model: "gemini-2.5-flash",
//   contents: "difference between sql and mongodb",
// });

// console.log(response.text);


export default getGeminiAPIResponse;