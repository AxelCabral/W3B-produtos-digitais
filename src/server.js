import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3007;

// Caminho absoluto para os arquivos estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para servir arquivos estáticos e JSON
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

app.use(helmet());

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 5000, 
    message: "Muitas requisições. Tente novamente mais tarde.",
});

app.use(limiter);

// Chaves dos conteúdos
const contents = {
  'JSKDHH28AA12KJHS009S': 'product-digital-pro/digitalpropack-KSHDB89172JG.html', //Digital pro (Pacote PRO)
  'U7221SKSNNBAGF10PIU': 'product-digital-pro/digitalpropack-AHSLAKDSJD98Q.html', //Digital pro (Pacote Gold)
  'LKPPA52I9O0A1L6LL3CM': 'product-digital-pro/digitalpropack-90002711AHGS0.html' //Digital pro (Pacote Elite)
}

// Endpoint para liberar acesso ao conteúdo por chave
app.post('/key/content', (req, res) => {
  const { key } = req.body;
  const valid = verifyKey(key);

  if (!valid) return res.status(400).json({ success: false });

  return res.json({ success: true, url: `/protected-content/${key}` });
});

// Novo endpoint para servir o conteúdo diretamente
app.get('/protected-content/:key', (req, res) => {
  const key = req.params.key;
  const relativePath = verifyKey(key);
  
  if (!relativePath) {
    return res.status(403).send('Acesso não autorizado.');
  }

  const filePath = path.join(__dirname, '../content', relativePath);
  res.sendFile(filePath);
});


function verifyKey(key){
  return contents[key] || null;
}


// Inicializa o servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
