import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { jogosSerieB } from '../statics';
import { historiasSerieB } from '../history';

// ---------------------------------------------------------------
// Mapeamento de logos e placeholders por nome de clube
// ---------------------------------------------------------------
const logos = {
  'Athletico-PR': require('../assets/athletico-pr.png'),
  'Athletic Club': require('../assets/athletic.png'),
  'Goiás': require('../assets/goias.png'),
  'Ferroviária': require('../assets/ferroviaria.png'),
  'Cuiabá': require('../assets/cuiaba.png'),
  'Vila Nova': require('../assets/vilanova.png'),
  'Remo': require('../assets/remo.png'),
  'Volta Redonda': require('../assets/voltaredonda.png'),
  'Avaí': require('../assets/avai.png'),
  'Chapecoense': require('../assets/chapecoense.png'),
  'Criciúma': require('../assets/criciuma.png'),
  'Coritiba': require('../assets/coritiba.png'),
  'Amazonas': require('../assets/amazonas.png'),
  'Operário-PR': require('../assets/operario.png'),
  'América-MG': require('../assets/america-mg.png'),
  'Atlético-GO': require('../assets/atletico-go.png'),
  'Novorizontino': require('../assets/novorinzontino.png'),
  'Paysandu': require('../assets/paysandu.png'),
  'Botafogo-SP': require('../assets/botafogo-sp.png'),
  'CRB': require('../assets/crb.png'),
};

const placeholderImages = {
  'Athletico-PR': require('../assets/placeholders/athletico-pr.png'),
  'Athletic Club': require('../assets/placeholders/athletic.png'),
  'Goiás': require('../assets/placeholders/goias.png'),
  'Ferroviária': require('../assets/placeholders/ferroviaria.png'),
  'Cuiabá': require('../assets/placeholders/cuiaba.png'),
  'Vila Nova': require('../assets/placeholders/vilanova.png'),
  'Remo': require('../assets/placeholders/remo.png'),
  'Volta Redonda': require('../assets/placeholders/voltaredonda.png'),
  'Avaí': require('../assets/placeholders/avai.png'),
  'Chapecoense': require('../assets/placeholders/chapecoense.png'),
  'Criciúma': require('../assets/placeholders/criciuma.png'),
  'Coritiba': require('../assets/placeholders/coritiba.png'),
  'Amazonas': require('../assets/placeholders/amazonas.png'),
  'Operário-PR': require('../assets/placeholders/operario.png'),
  'América-MG': require('../assets/placeholders/america-mg.png'),
  'Atlético-GO': require('../assets/placeholders/atletico-go.png'),
  'Novorizontino': require('../assets/placeholders/novorizontino.png'),
  'Paysandu': require('../assets/placeholders/paysandu.png'),
  'Botafogo-SP': require('../assets/placeholders/botafogo-sp.png'),
  'CRB': require('../assets/placeholders/crb.png'),
  default: require('../assets/placeholders/default.png'),
};

// Token da GNews para buscar notícias
const GNEWS_TOKEN = 'eb49041dbe2d8384fbe6c8fd02a2aff4';

export default function NewsScreen({ route }) {
  const { clube } = route.params;

  // ---------------------------------------------------------------
  // 1) Monta lista de rodadas disponíveis a partir de `jogosSerieB`
  // ---------------------------------------------------------------
  const rodadasDisponiveis = Array.from(
    new Set(jogosSerieB.map((j) => j.rodada))
  ).sort((a, b) => a - b);

  // 2) Determina a "última" rodada (por padrão o app mostra a rodada mais alta)
  const ultimaRodada = rodadasDisponiveis[rodadasDisponiveis.length - 1];
  const [rodadaIndex, setRodadaIndex] = useState(
    rodadasDisponiveis.indexOf(ultimaRodada)
  );

  // ---------------------------------------------------------------
  // Estados para as notícias (carregar do GNews)
  // ---------------------------------------------------------------
  const [news, setNews] = useState([]);       // Array de artigos
  const [loading, setLoading] = useState(true); // Indicador de carregamento
  const [newsIndex, setNewsIndex] = useState(0); // Índice da notícia atual

  // ---------------------------------------------------------------
  // 3) Busca as notícias via GNews sempre que muda o `clube`
  // ---------------------------------------------------------------
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const query = encodeURIComponent(clube + ' futebol');
        const res = await fetch(
          `https://gnews.io/api/v4/search?q=${query}&lang=pt&max=10&token=${GNEWS_TOKEN}`
        );
        const data = await res.json();
        setNews(data.articles || []);
      } catch (err) {
        console.error('Erro ao buscar notícias:', err);
      } finally {
        setLoading(false);
        setNewsIndex(0); // reinicia no primeiro artigo
      }
    };
    fetchNews();
  }, [clube]);

  // ---------------------------------------------------------------
  // 4) Retorna o jogo do clube na rodada selecionada (ou null)
  // ---------------------------------------------------------------
  const getJogoDaRodadaAtual = () => {
    const rodadaAtual = rodadasDisponiveis[rodadaIndex];
    const partidas = jogosSerieB.filter(
      (j) =>
        j.rodada === rodadaAtual &&
        (j.casa.toLowerCase() === clube.toLowerCase() ||
          j.fora.toLowerCase() === clube.toLowerCase())
    );
    return partidas.length > 0 ? partidas[0] : null;
  };

  const jogoAtual = getJogoDaRodadaAtual();
  const logoCasa = jogoAtual ? logos[jogoAtual.casa] : null;
  const logoFora = jogoAtual ? logos[jogoAtual.fora] : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ==================================================================
         A) NAVIGAÇÃO ENTRE RODADAS (setas laterais + "Rodada X")
      =================================================================== */}
      <View style={styles.rodadaNavContainer}>
        <TouchableOpacity
          onPress={() =>
            rodadaIndex > 0 && setRodadaIndex(rodadaIndex - 1)
          }
          disabled={rodadaIndex === 0}
          style={[
            styles.rodadaButton,
            rodadaIndex === 0 && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.rodadaArrow}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.rodadaText}>
          Rodada {rodadasDisponiveis[rodadaIndex]}
        </Text>

        <TouchableOpacity
          onPress={() =>
            rodadaIndex < rodadasDisponiveis.length - 1 &&
            setRodadaIndex(rodadaIndex + 1)
          }
          disabled={rodadaIndex === rodadasDisponiveis.length - 1}
          style={[
            styles.rodadaButton,
            rodadaIndex === rodadasDisponiveis.length - 1 &&
              styles.buttonDisabled,
          ]}
        >
          <Text style={styles.rodadaArrow}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* ==================================================================
         B) CARD DO JOGO – mostra o jogo do clube na rodada selecionada
      =================================================================== */}
      {jogoAtual ? (
        <View style={styles.card}>
          <View style={styles.matchInfo}>
            <View style={styles.teamsRow}>
              <View style={styles.team}>
                {logoCasa && <Image source={logoCasa} style={styles.logo} />}
                <Text style={styles.teamName}>{jogoAtual.casa}</Text>
              </View>
              <Text style={styles.vs}>X</Text>
              <View style={styles.team}>
                {logoFora && <Image source={logoFora} style={styles.logo} />}
                <Text style={styles.teamName}>{jogoAtual.fora}</Text>
              </View>
            </View>
            <Text style={styles.stadium}>{jogoAtual.local}</Text>
            <Text style={styles.datetime}>
              Data: {jogoAtual.data} ({jogoAtual.dia})
            </Text>
            <Text style={styles.datetime}>
              Horário: {jogoAtual.horario}
            </Text>
            <Text style={styles.result}>
              {jogoAtual.resultado === 'Acontecerá'
                ? 'Partida ainda não aconteceu'
                : `Resultado: ${jogoAtual.resultado}`}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.noMatchText}>
            Nenhum jogo do {clube} na Rodada{' '}
            {rodadasDisponiveis[rodadaIndex]}
          </Text>
        </View>
      )}

      {/* ==================================================================
         C) CABEÇALHO DE NOTÍCIAS – setas laterais + "ÚLTIMAS NOTÍCIAS"
      =================================================================== */}
      <View style={styles.newsHeaderContainer}>
        <TouchableOpacity
          onPress={() =>
            newsIndex > 0 && setNewsIndex(newsIndex - 1)
          }
          disabled={newsIndex === 0}
          style={[
            styles.newsArrowButton,
            newsIndex === 0 && styles.navButtonDisabled,
          ]}
        >
          <Text style={[styles.navArrow, { fontSize: 32 }]}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.newsHeaderText}>ÚLTIMAS NOTÍCIAS</Text>

        <TouchableOpacity
          onPress={() =>
            newsIndex < news.length - 1 &&
            setNewsIndex(newsIndex + 1)
          }
          disabled={newsIndex === news.length - 1}
          style={[
            styles.newsArrowButton,
            newsIndex === news.length - 1 && styles.navButtonDisabled,
          ]}
        >
          <Text style={[styles.navArrow, { fontSize: 32 }]}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* ==================================================================
         D) CARD DE NOTÍCIA – exibe a notícia atual abaixo do cabeçalho
      =================================================================== */}
      <View style={styles.newsSection}>
        {loading ? (
          <ActivityIndicator size="large" color="#33673B" />
        ) : news.length === 0 ? (
          <Text style={styles.noNewsText}>Nenhuma notícia encontrada.</Text>
        ) : (
          // Mostrar somente o card da notícia no centro
          <TouchableOpacity
            style={styles.newsCard}
            onPress={() => {
              const url = news[newsIndex].url;
              if (url) Linking.openURL(url);
            }}
          >
            <Image
              source={
                news[newsIndex].image
                  ? { uri: news[newsIndex].image }
                  : placeholderImages[clube] || placeholderImages.default
              }
              style={styles.newsImage}
            />
            <View style={styles.newsContent}>
              <Text style={styles.newsTitle}>
                {news[newsIndex].title}
              </Text>
              <Text style={styles.newsDescription}>
                {news[newsIndex].description}
              </Text>
              <Text style={styles.newsLink}>
                Toque para ler matéria completa
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* ==================================================================
         E) CARD DE HISTÓRIA DO CLUBE – aparece após o card de notícias
      =================================================================== */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{clube} na Série B</Text>
        <Text style={styles.historyText}>
          {historiasSerieB[clube] ||
            'História não disponível para este clube.'}
        </Text>
      </View>
    </ScrollView>
  );
}

// ---------------------------------------------------------------
// Estilos (bordas arredondadas, cores, sombras, padding etc.)
// ---------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },

  // ================================================
  // Navegação entre rodadas (setas + texto)
  // ================================================
  rodadaNavContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
    justifyContent: 'center',
  },
  rodadaButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    padding: 6,
    marginHorizontal: 12,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  rodadaArrow: {
    fontSize: 28,
    color: '#33673B',
  },
  rodadaText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#33673B',
  },

  // ================================================
  // Card Padrão (Jogo e História)
  // ================================================
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 3, // sombra Android
    shadowColor: '#000', // sombra iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 20,
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  matchInfo: {
    alignItems: 'center',
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  team: {
    alignItems: 'center',
    width: 100,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  teamName: {
    fontSize: 12,
    marginTop: 12,
    textAlign: 'center',
  },
  vs: {
    marginHorizontal: 12,
    fontSize: 60,
    fontWeight: 'bold',
    color: '#333333',
  },
  stadium: {
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'center',
    color: '#555555',
  },
  datetime: {
    fontSize: 12,
    color: '#555555',
    textAlign: 'center',
  },
  result: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#33673B',
    textAlign: 'center',
  },
  noMatchText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#33673B',
  },
  historyText: {
    fontSize: 16,
    color: '#444444',
    textAlign: 'justify',
    lineHeight: 22,
  },

  // ================================================
  // Cabeçalho de Notícias (setas + "ÚLTIMAS NOTÍCIAS")
  // ================================================
  newsHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    marginBottom: 12,
  },
  newsHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#33673B',
    marginHorizontal: 12,
  },
  newsArrowButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    padding: 8,
  },

  // ================================================
  // Card de notícia (abaixo do cabeçalho)
  // ================================================
  newsSection: {
    width: '100%',
    marginBottom: 40,
  },
  noNewsText: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 14,
    marginVertical: 20,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navArrow: {
    fontSize: 28,
    color: '#33673B',
  },
  newsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    width: '100%',
  },
  newsImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  newsContent: {
    padding: 16,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#111111',
  },
  newsDescription: {
    fontSize: 14,
    color: '#444444',
    marginBottom: 10,
    lineHeight: 20,
  },
  newsLink: {
    fontSize: 14,
    color: '#1E90FF',
    fontWeight: '500',
    textAlign: 'right',
  },
});
