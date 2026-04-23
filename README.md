# Site Dra. Emanoela

## Decap CMS

O painel fica em `/admin/`.

### Para testar localmente

1. Sirva a pasta do site em um servidor estático.
2. Em outro terminal, na raiz do projeto, rode `npx decap-server` para subir o proxy local na porta `8081`.
3. Abra `/admin/` no navegador.

Se você estiver usando o Live Server na porta `5500`, isso cobre só o site. O Decap CMS ainda precisa do proxy em `http://localhost:8081/api/v1` para funcionar com `local_backend: true`.

### Estrutura criada

- `admin/index.html` - carrega o Decap CMS.
- `admin/config.yml` - define a coleção `Blog`.
- `content/blog/primeiro-post.md` - post de exemplo para teste.
- `content/blog/index.json` - índice gerado automaticamente para a página `/blog/`.

### Blog público

A página pública em `/blog/` lê `content/blog/index.json` e monta os cards dos posts automaticamente.
Cada post também gera uma página bonita própria em `/blog/<slug>/`, então o card não abre mais o `.md` bruto.
Para atualizar o índice depois de criar ou editar posts, rode:

```bash
node scripts/generate-blog-index.mjs
```

### Modo em tempo real

Se quiser ver os posts aparecerem automaticamente enquanto usa o Decap CMS, deixe este watcher rodando em outro terminal:

```bash
node scripts/watch-blog.mjs
```

Assim, toda vez que um `.md` em `content/blog` for criado ou alterado, o índice e as páginas bonitas em `/blog/<slug>/` são regenerados na hora.
