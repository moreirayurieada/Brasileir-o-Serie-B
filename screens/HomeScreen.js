import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const clubesSerieB = [
  { nome: 'Amazonas', logo: require('../assets/amazonas.png') },
  { nome: 'América-MG', logo: require('../assets/america-mg.png') },
  { nome: 'Athletic Club', logo: require('../assets/athletic.png') },
  { nome: 'Atlético-GO', logo: require('../assets/atletico-go.png') },
  { nome: 'Athletico-PR', logo: require('../assets/athletico-pr.png') },
  { nome: 'Avaí', logo: require('../assets/avai.png') },
  { nome: 'Botafogo-SP', logo: require('../assets/botafogo-sp.png') },
  { nome: 'Chapecoense', logo: require('../assets/chapecoense.png') },
  { nome: 'CRB', logo: require('../assets/crb.png') },
  { nome: 'Criciúma', logo: require('../assets/criciuma.png') },
  { nome: 'Coritiba', logo: require('../assets/coritiba.png') },
  { nome: 'Cuiabá', logo: require('../assets/cuiaba.png') },
  { nome: 'Ferroviária', logo: require('../assets/ferroviaria.png') },
  { nome: 'Goiás', logo: require('../assets/goias.png') },
  { nome: 'Novorizontino', logo: require('../assets/novorinzontino.png') },
  { nome: 'Operário-PR', logo: require('../assets/operario.png') },
  { nome: 'Paysandu', logo: require('../assets/paysandu.png') },
  { nome: 'Remo', logo: require('../assets/remo.png') },
  { nome: 'Vila Nova', logo: require('../assets/vilanova.png') },
  { nome: 'Volta Redonda', logo: require('../assets/voltaredonda.png') },
];

const API_KEY = 'live_61001ba43c2f05c1a7ba1fe60877fa';
const TABELA_URL = 'https://api.api-futebol.com.br/v1/campeonatos/14/tabela';

export default function HomeScreen() {
  const [tabela, setTabela] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTabela = async () => {
      try {
        const res = await axios.get(TABELA_URL, {
          headers: { Authorization: `Bearer ${API_KEY}` },
        });
        setTabela(res.data);
      } catch (err) {
        console.error('Erro ao buscar tabela:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTabela();
  }, []);

  const getLogoByName = (nome) => {
    const clube = clubesSerieB.find((c) => c.nome === nome);
    return clube ? clube.logo : null;
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <Image source={require('../assets/serieB.png')} style={styles.banner} />

      {/* LINHA VERDE DIVISORA */}
      <View style={styles.divider} />

      {/* CARROSSEL DE LOGOS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
        {clubesSerieB.map((clube, index) => (
          <TouchableOpacity
            key={index}
            style={styles.logoContainer}
            onPress={() => navigation.navigate('NewsScreen', { clube: clube.nome })}
          >
            <Image source={clube.logo} style={styles.logo} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* CARD DA TABELA */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Classificação</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, styles.headerCell]}>#</Text>
          <Text style={[styles.cell, styles.headerCell, { flex: 3 }]}>Clube</Text>
          <Text style={[styles.cell, styles.headerCell]}>Pts</Text>
          <Text style={[styles.cell, styles.headerCell]}>J</Text>
          <Text style={[styles.cell, styles.headerCell]}>V</Text>
          <Text style={[styles.cell, styles.headerCell]}>E</Text>
          <Text style={[styles.cell, styles.headerCell]}>D</Text>
          <Text style={[styles.cell, styles.headerCell]}>SG</Text>
        </View>

        {tabela.map((time, index) => {
          const logo = getLogoByName(time.time.nome_popular);
          const isPrimeiro = index === 0;
          const bgColor =
            index < 4 ? '#d4f4d7' :
            index >= tabela.length - 4 ? '#f9d6d5' : '#fff';
          const fontStyle = isPrimeiro ? { fontWeight: 'bold' } : {};

          const positionColor =
            index < 4 ? '#008000' :
            index >= tabela.length - 4 ? '#B22222' : '#000';

          return (
            <View key={time.time.time_id} style={[styles.tableRow, { backgroundColor: bgColor }]}>
              <Text style={[styles.cell, fontStyle, { color: positionColor, fontWeight: 'bold' }]}>
                {index + 1}º
              </Text>
              <View style={[styles.cell, { flex: 3, flexDirection: 'row', alignItems: 'center' }]}>
                {logo && <Image source={logo} style={styles.tableLogo} />}
                <Text style={[{ marginLeft: 5 }, fontStyle]}>{time.time.nome_popular}</Text>
              </View>
              <Text style={[styles.cell, fontStyle]}>{time.pontos}</Text>
              <Text style={[styles.cell, fontStyle]}>{time.jogos}</Text>
              <Text style={[styles.cell, fontStyle]}>{time.vitorias}</Text>
              <Text style={[styles.cell, fontStyle]}>{time.empates}</Text>
              <Text style={[styles.cell, fontStyle]}>{time.derrotas}</Text>
              <Text style={[styles.cell, fontStyle]}>{time.saldo_gols}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 30,
  },
  banner: {
    width: '100%',
    height: 80,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  divider: {
    height: 1,
    backgroundColor: 'green',
    marginVertical: 6,
    marginHorizontal: 12,
    borderRadius: 2,
  },
  carousel: {
    paddingVertical: 4,
    paddingHorizontal: 5,
  },
  logoContainer: {
    alignItems: 'center',
    marginHorizontal: 6,
  },
  logo: {
    width: 59,
    height: 36,
    resizeMode: 'contain',
  },
  card: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 8,
    borderRadius: 14,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderRadius: 6,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  cell: {
    flex: 1,
    fontSize: 11,
    color: '#000',
  },
  headerCell: {
    fontWeight: 'bold',
  },
  tableLogo: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginRight: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
