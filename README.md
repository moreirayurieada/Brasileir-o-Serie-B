# 📱 Brasileirão Série B App

Aplicativo em *React Native* que oferece uma experiência completa sobre a Série B do Campeonato Brasileiro. Com visual moderno e funcionalidade intuitiva, o app apresenta clubes, jogos, notícias, tabela e história dos times.

---

## 🚀 Funcionalidades

- 🔁 *Carrossel de Clubes*: Navegue entre os times da Série B na tela inicial.
- 📅 *Jogos*: Exibe partidas, datas e adversários (dados locais via statics.js).
- 🧾 *História do Clube*: Curta descrição histórica de cada time.
- 📰 *Card de Notícias*: Exibe as principais notícias recentes relacionadas ao clube selecionado (via GNews API).
- 🏆 *Tabela da Série B*: Mostra a classificação atualizada da competição (via API de futebol).
- 🖼 *Imagens Padrão por Clube*: Quando uma notícia não contém imagem, uma imagem local é usada como fallback, específica para cada clube.


---

## 📦 Bibliotecas Utilizadas

| Biblioteca                        | Função                                           |
| -------------------------------- | ------------------------------------------------ |
| @react-navigation/native       | Navegação entre telas                            |
| @react-navigation/native-stack | Pilha de navegação                               |
| react-native-snap-carousel     | Carrossel para times                             |
| axios                          | Requisições HTTP (APIs de tabela e notícias)     |
| react-native-vector-icons     | Ícones                                           |
| react-native-reanimated       | Animações                                        |
| react-native-gesture-handler  | Gestos                                           |
| react-native-safe-area-context| Layout seguro em telas                           |
| react-native-screens          | Otimização de navegação                          |

---

## 🔗 APIs Utilizadas

### 📊 Tabela da Série B

A tabela é exibida dinamicamente com dados da seguinte API (exemplo gratuito):

- [API-Football-Standings (N8N proxy ou futebol-data.org)](https://docs.football-data.org/)
- Endpoint: https://api.football-data.org/v4/competitions/BSA/standings
- Método: GET
- Headers: { "X-Auth-Token": "SUA_CHAVE_API" }
- Exibe: posição, nome do time, pontos, jogos, vitórias, empates, derrotas.

### 📰 Notícias (GNews)

Utiliza a [GNews API](https://gnews.io/) para buscar notícias dos clubes.

- Endpoint:  
  https://gnews.io/api/v4/search?q={NOME_DO_CLUBE}&lang=pt&token=SUA_CHAVE
- Campos usados: título, imagem, descrição, data, link.
- Fallback de imagem local quando image === null.

---

## ▶ Como Rodar o Projeto

### Pré-requisitos

- Node.js
- React Native CLI
- Emulador Android/iOS ou dispositivo real

### Instalação

```bash
# Clone o projeto
git clone https://github.com/seu-usuario/brasileirao-serie-b-app.git
cd brasileirao-serie-b-app

# Instale dependências
npm install

# Rode no Android
npx react-native run-android

# Ou no iOS
cd ios && pod install && cd ..
npx react-native run-ios
