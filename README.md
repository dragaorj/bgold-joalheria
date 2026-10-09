# BGold Joalheria · site

Site institucional da BGold Joalheria: um filme controlado pela rolagem (do
desenho técnico à aliança no dedo), seguido das seções da joalheria, criações,
processo, depoimentos e contato. Em português, inglês e espanhol, com modo
claro e escuro.

**Stack:** Vite · React 18 · TypeScript · Tailwind CSS 3 · GSAP (ScrollTrigger + SplitText) · Lenis

## Rodar localmente

Requer Node 18 ou superior.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera a pasta dist/
npm run preview  # serve o build localmente
```

## Publicar (Vercel)

Importe o repositório na Vercel. Ela detecta o Vite automaticamente:

- Build Command: `npm run build`
- Output Directory: `dist`

Cada `git push` na branch `main` publica uma nova versão.

## Onde editar

| O quê | Arquivo |
|---|---|
| Todos os textos (PT, EN, ES) | `src/i18n/strings.ts` |
| Link do Instagram, capítulos e tempo do filme | `src/config/film.ts` |
| Vídeos das seções e enquadramento de cada um | `src/config/reels.ts` |
| Depoimentos (fotos, estilo dos cards, aviso) | `src/config/clients.ts` |
| Cores, fontes, espaçamentos | `src/styles/index.css` |
| Seções da página | `src/components/sections/` |
| Filme da abertura | `src/components/film/` |

### Depoimentos

Os textos e fotos atuais são ilustrativos e a seção mostra a linha
"Depoimentos e imagens ilustrativos." Para usar depoimentos reais:

1. Troque os textos em `clients.items` em `src/i18n/strings.ts` (com autorização dos clientes).
2. Coloque as fotos em `public/media/clients/` (c1.jpg a c9.jpg, quadradas).
3. Mude `CLIENTS_ARE_EXAMPLES` para `false` em `src/config/clients.ts`. O aviso some.

## Como o filme funciona

Um único ScrollTrigger lê o progresso da rolagem da seção fixada e, no mesmo
instante, define o quadro do vídeo e o estado de todos os textos. Por isso
vídeo e texto nunca saem de sincronia e voltar a rolagem reverte tudo junto.

Os fades e textos sobre o filme acompanham o próprio vídeo (claros no desenho,
escuros na cena da mão), independentemente do botão de modo claro/escuro.

## Mídia

Os arquivos em `public/media/` já estão otimizados:

- `bgold-film-1080.mp4` (desktop) e `bgold-film-portrait.mp4` (celular, com o
  recorte acompanhando o anel). Todos os quadros são keyframes, para a rolagem
  ser exata nos dois sentidos.
- `seq-l/` e `seq-p/`: quadros JPEG usados só se o navegador não conseguir
  avançar o vídeo com precisão.
- `reels/`: vídeos das seções, sem áudio.
- `creations/` e `clients/`: fotos.

Os vídeos originais (4K e Instagram) não estão no repositório. Para reprocessar
um vídeo, use o [ffmpeg](https://ffmpeg.org), por exemplo:

```bash
ffmpeg -i original.mp4 -an -vf "scale=1920:-2,format=yuv420p" -c:v libx264 -preset slow -crf 22 -g 1 -bf 0 -movflags +faststart public/media/bgold-film-1080.mp4
```
