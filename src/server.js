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

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, '../public', '404.html'));
});

app.use(helmet());

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 5000, 
    message: "Muitas requisições. Tente novamente mais tarde.",
});

app.use(limiter);

// Chaves dos conteúdos
const contents = {
  'JSKDHH28AA12KJHS009S': 'digitalpropack-KSHDB89172JG', //Digital pro (Pacote PRO)
  'U7221SKSNNBAGF10PIU': 'digitalpropack2-LAJDSKJD9711A' //Digital pro (Pacote Elite)
}

// Endpoint para liberar acesso ao conteúdo por chave
app.post('/key/content', async (req, res) => {
  try {
    const { key } = req.body;

    const link = verifyKey(key);
    
    if (!key || typeof key != 'string' || key.length > 20 || link == null) return res.status(400).json({ success: false, message: 'Chave inválida.' });

    return res.redirect(`/content/${link}`);

  } catch (error) {
      res.status(404).json({ success: false, message: 'Não foi encontrado nenhum produto na chave informada.'});
  }
});

function verifyKey(key){
  return contents[key] || null;
}

app.get('/content/:pack', (req, res) => {
  const { pack } = req.params;
  const filePath = path.join(__dirname, 'content', `${pack}.html`);

  console.log(filePath);

  res.sendFile(filePath, err => {
      if (err) {
          res.status(404).send('Conteúdo não encontrado.');
      }
  });
});

// Inicializa o servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
