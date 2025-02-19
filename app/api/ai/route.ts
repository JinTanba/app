import { NextResponse } from "next/server";
import {load} from "cheerio";

export async function getLinkMeta(url: string) {
  try {
    // fetch オプションは必要に応じて調整してください
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${url}`);
    }
    const html = await res.text();
    const $ = load(html);

    // メタタグなどからタイトルを取得
    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").text() ||
      "";

    // メタタグから説明文を取得
    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      "";

    // メタタグから画像URLを取得
    const image =
      $('meta[property="og:image"]').attr("content") ||
      "";

    return {
      url,
      title,
      description,
      image,
    };
  } catch (error) {
    console.error("getLinkMeta error:", error);
    // 失敗時のフォールバック
    return {
      url,
      title: "",
      description: "",
      image: "",
    };
  }
}

const ppAPI = process.env.PP;
        // Perplexity API key
const openAIApiKey = process.env.OPENAI_API_KEY!; // OpenAI API key
const model = "sonar-pro";
export const runtime = 'edge' // エッジランタイムを使用
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("ai request body:", body);

    // 1. Perplexity への問い合わせ内容を作成
    const prompt =body.description ? `
      Tell me about the following news.
      NEWS:
      - ${body.title}\n
        ${body.description}
    `.replace(/\n/g, " ").trim() : `search about content about \n${body.title}`;

    const ppOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ppAPI}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "Be precise and concise." },
          { role: "user", content: prompt },
        ],
        max_tokens: null,
        temperature: 0.2,
        top_p: 0.9,
        search_domain_filter: [],
        return_images: false,
        return_related_questions: false,
        search_recency_filter: "month",
        top_k: 0,
        stream: false,
        presence_penalty: 0,
        frequency_penalty: 1,
        response_format: null,
      }),
    };

    // 2. Perplexity API呼び出し
    const ppRes = await fetch("https://api.perplexity.ai/chat/completions", ppOptions);
    const ppResJson = await ppRes.json();
    console.log("ppResJson:", ppResJson);

    // 生成された要約文（テキスト）
    const content = ppResJson?.choices?.[0]?.message?.content ?? "";

    // 3. Perplexity が返す citations (リンク配列) を取得して、リンク先メタを取得
    const linkArray: string[] = ppResJson?.citations ?? [];
    const articles = await Promise.all(
      linkArray.map(async (link) => {
        const meta = await getLinkMeta(link);
        return meta;
      })
    );

    // 4. 「自動生成を感知」したら、OpenAI の Image Generation API (DALL·E) を呼ぶ
    //    body.useOpenAIImage が true であれば画像生成を行う、という例
    let imageUrl = null;

    if (body.useOpenAIImage) {
      console.log("OpenAI Image API を呼び出します...");
      const imagePrompt = `以下のコンテンツについてのイラストを書いて。ただし人は書かないで\n${content.slice(0,200)}`; // 生成されたテキストをそのまま使う場合

      const openAIOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAIApiKey}`,
        },
        body: JSON.stringify({
          prompt: imagePrompt,
          n: 1,        // 生成する画像枚数
          size: "512x512", // 画像サイズ (256x256, 512x512, 1024x1024 が選択可能)
        }),
      };

      // OpenAI Image Generation API 呼び出し
      let openAIRes;
      try {
        openAIRes = await fetch("https://api.openai.com/v1/images/generations", openAIOptions);
      }catch(e) {
        console.log(e);
        openAIRes = {ok: false};
      }
      if (!openAIRes.ok) {
        console.log('OPENAI ERROR');
      }
      imageUrl = !openAIRes.ok ? "https://illust8.com/wp-content/uploads/2018/08/mark_kinshi_897.png" : (await openAIRes.json())?.data?.[0]?.url || "";
      console.log("imageUrl:", imageUrl);
    }

    // 5. テキスト (content) + 画像URL (imageUrl) + 記事メタ情報 (articles) をまとめて返す
    return NextResponse.json(
      {
        message: "Data received",
        body,
        content,    // Perplexity で生成された文章
        imageUrl,   // 画像生成結果
        articles,   // メタ情報付きの記事一覧
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("ERROR", error);
    return NextResponse.json(
      { message: "fail to generate summarize" },
      { status: 200 }
    );
  }
}
