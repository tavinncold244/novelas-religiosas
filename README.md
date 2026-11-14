# NOVELAS RELIGIOSAS

Ferramentas, skills `novela-fe` (página de fé) e `novela-ia`, sfx, música e roteiros das novelas de IA.
Os vídeos (projetos/, saida/, youtube_shorts/, thumbs/, referencias/) **não** vão pro GitHub, só os textos.

## Instalar em outro PC
```bash
git clone https://github.com/tavinncold244/novelas-religiosas.git "E:/NOVELAS RELIGIOSAS"
cd "E:/NOVELAS RELIGIOSAS"
npm install
```
Precisa também de: Node 20+, ffmpeg no PATH, whisper.cpp em `E:\Ferramentas\whisper\Release`
(ou ajustar `WHISPER_DIR` em ferramentas/editor.mjs, novela.mjs, revisar.mjs) e o MCP `repostore-video` no Claude Code.

Atualizar depois: `git pull`

As skills ficam em `.claude/skills/` e o Claude Code carrega sozinho ao abrir esta pasta.
A fonte `ferramentas/shorts/impact.ttf` não vai no repo: copiar de `C:/Windows/Fonts/impact.ttf`.
