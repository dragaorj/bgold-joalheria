# BGold Joalheria · site cinematográfico

Vite + React 18 + TypeScript + Tailwind 3 + GSAP ScrollTrigger + Lenis.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Arquitetura

| Camada | Arquivo |
|---|---|
| Configuração do filme (capítulos, mapa rolagem → vídeo) | `src/config/film.ts` |
| Controle do vídeo (seek serializado, fallback em sequência de imagens) | `src/lib/filmScrubber.ts` |
| Rolagem (Lenis + ScrollTrigger) | `src/lib/scroll.ts` |
| Coreografia dos capítulos (timeline de duração 1 = progresso da rolagem) | `src/components/film/FilmTimeline.ts` |
| Seção fixada do filme | `src/components/film/CinematicFilm.tsx` |
| Régua de progresso (assinatura visual) | `src/components/film/DraftRule.tsx` |
| Revelações das seções seguintes | `src/lib/reveal.ts` |
| Navegação / menu mobile | `src/components/Nav.tsx` |
| Seções | `src/components/sections/*` |

Um único `ScrollTrigger` lê o progresso `p` da seção fixada e, no mesmo callback,
define o quadro do vídeo (`videoProgressAt(p)`) e o progresso da timeline de texto
(`tl.progress(p)`). Como tudo deriva do mesmo número, nada sai de sincronia e
voltar a rolagem reverte vídeo e texto juntos.

## Vídeo

Original: `source/bgold-film-source.mp4` (4K, 24fps, 6,04s, GOP longo: ruim para seek).

Derivados em `public/media/`, todos com **todos os quadros como keyframe** (`-g 1`),
para seek exato e imediato nos dois sentidos:

- `bgold-film-1080.mp4`: 1920×1070, desktop (7,6 MB)
- `bgold-film-portrait.mp4`: 1080×1920, celular; o recorte acompanha o anel ao longo do filme (5,5 MB)
- `seq-l/`, `seq-p/`: 73 quadros JPEG (12fps), usados só se o navegador não conseguir fazer seek
- `stills/`: quadros do filme usados nas seções editoriais

Para regenerar (ffmpeg vem do pacote `ffmpeg-static`):

```bash
node_modules/ffmpeg-static/ffmpeg.exe -i source/bgold-film-source.mp4 -an \
  -vf "scale=1920:-2:flags=lanczos,format=yuv420p" -c:v libx264 -preset slow \
  -crf 22 -g 1 -keyint_min 1 -bf 0 -movflags +faststart public/media/bgold-film-1080.mp4
```
