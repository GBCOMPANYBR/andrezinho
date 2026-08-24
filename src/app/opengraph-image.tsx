import { ImageResponse } from "next/og";

export const alt = "Andrezinho — preço de oportunidade, negócio de verdade";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src: url\(([^)]+)\) format\('(opentype|truetype)'\)/);
  if (match) {
    const res = await fetch(match[1]);
    if (res.status === 200) return res.arrayBuffer();
  }
  throw new Error("Falha ao carregar a fonte para a imagem OG");
}

export default async function Image() {
  const frauncesData = await loadGoogleFont("Fraunces:wght@600", "andrezinho");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#083A2A",
        }}
      >
        <svg width="140" height="140" viewBox="0 0 200 200">
          <path
            d="M 30 160 A 70 70 0 0 1 170 160"
            fill="none"
            stroke="#FBF8F3"
            strokeWidth="26"
            strokeLinecap="round"
          />
          <circle cx="100" cy="90" r="24" fill="#FBF8F3" />
          <path
            d="M 90 90 L 98 99 L 112 78"
            stroke="#E6832B"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M 100 128 L 88 168 M 100 128 L 112 168 M 93 152 L 107 152"
            stroke="#E6832B"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <div
          style={{
            marginTop: 36,
            fontSize: 80,
            fontFamily: "Fraunces",
            fontWeight: 600,
            color: "#FBF8F3",
          }}
        >
          andrezinho
        </div>
        <div
          style={{
            marginTop: 22,
            fontSize: 32,
            color: "rgba(251,248,243,0.72)",
          }}
        >
          Preço de oportunidade. Negócio de verdade.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Fraunces", data: frauncesData, style: "normal", weight: 600 }],
    }
  );
}
