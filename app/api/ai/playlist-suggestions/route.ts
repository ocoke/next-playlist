import { streamObject, StreamData } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
export const maxDuration = 60;

const system: string = `

# AI Instruction for \`next-playlist\` Assistant

## **Objective**
Your mission is to suggest a personalized music playlist for users based on their inputs. Focus on delivering relevant and creative recommendations that align with their preferences.

---

## **Inputs**
1. **Keywords**: 
   - Descriptions of the desired playlist mood, season, weather, and preferred genres.
   - Example: \`#chill #jazz #rainy-day\`.

2. **User's Musical Taste**: 
   - A reference list of songs the user already likes. Use this to infer their musical preferences (e.g., genres, themes, moods).

3. **Playlist Length**: 
   - The number of songs requested.

4. **Preference for Existing Songs (already in the references)**:
   - User’s preference for including old songs:
     - \`none\`: Exclude all the songs that are already in the list.
     - \`some\`: Include a few.
     - \`mostly\`: Majority are songs in the reference.
     - \`completely\`: Only songs in the reference.

---

## **Task**
1. **Analyze the Reference List**:
   - Infer the user’s musical taste, including preferred genres, themes, and moods.
   - Identify patterns or standout characteristics.

2. **Create the Playlist**:
   - Suggest songs that align with the **keywords** while reflecting the user's musical taste.
   - Incorporate old songs based on the specified preference.

3. **Structure Your Output**:
   - **Playlist**: A list of song titles and artists.
   - **Analysis**: A short explanation of how the playlist matches the inputs.
   - **Suggestion Summary**: Highlight any notable themes or reasons for specific choices.

---

## **Guidelines**
- **Accuracy**: Prioritize alignment with keywords and inferred user preferences.
- **Creativity**: Suggest diverse, fitting songs that are likely to be available on major streaming platforms.
- **Clarity**: Make the output easy to understand and relevant.
- **No Redundancy**: Avoid repeating instructions or unrelated content in your response.

---

## **Output Example**

### Title

A short title for the whole playlist

### **Playlist**
1. **Song Title 1** - Artist 1
2. **Song Title 2** - Artist 2
3. **Song Title 3** - Artist 3

### **Analysis**
- The playlist reflects the requested mood of \`#chill\` and \`#rainy-day\` with soft jazz and acoustic tracks.
- User's preference for a mix of modern and old songs was applied, with 40% older hits included.

### **Suggestion Summary**
- A relaxing and cohesive list ideal for rainy days, blending nostalgia with contemporary vibes.



`;

export async function POST(req: Request) {
    const { prompt }: { prompt: string } = await req.json();

    // const { object } = await generateObject({
    //     model: google("models/gemini-1.5-pro"),
    //     system,
    //     prompt,
    //     schema: z.object({
    //         title: z.string().describe("A short title summarizing the playlist."),
    //         playlist: z.array(
    //             z.object({
    //                 title: z.string().describe("The title of the song."),
    //                 artist: z.string().describe("The name of the artist.")
    //             })
    //         ).describe("A list of songs in the playlist."),
    //         analysis: z.string().describe("A short explanation of how the playlist matches the user's inputs and preferences."),
    //         suggestionSummary: z.string().describe("A concise summary of the suggested playlist, highlighting themes and notable choices.")
    //     })
    // });
    const data = new StreamData();
    data.append({ test: 'initialized calls' });

    const result = streamObject({
        model: google("models/gemini-1.5-flash"),
        system,
        prompt,
        // output: 'array',
        schema: z.object({
            title: z.string().describe("A short title summarizing the playlist."),
            playlist: z.array(
                z.object({
                    title: z.string().describe("The title of the song."),
                    artist: z.string().describe("The name of the artist.")
                })
            ).describe("A list of songs in the playlist."),
            analysis: z.string().describe("A short explanation of how the playlist matches the user's inputs and preferences."),
            suggestionSummary: z.string().describe("A concise summary of the suggested playlist, highlighting themes and notable choices.")
        })
    });

    return result.toTextStreamResponse();
    // return Response.json({ code: 200, response: object });
}
