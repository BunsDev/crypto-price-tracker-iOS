import React, { useState, useEffect } from 'react'
import { View,Text,ActivityIndicator,StyleSheet,ScrollView } from 'react-native'
import axios from 'axios'
import { API_URL } from '../consts/app-consts'
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';


const DetailScreen = ({ route }) => {
    const { id } = route.params
    const [cryptoProfile, setCryptoProfile] = useState()
    const [cryptoMarketData, setCryptoMarketData] = useState()
    const [cryptoDataLoaded,setCryptoDataLoaded] = useState(false)
    const { width } = useWindowDimensions();


    useEffect(() => {
        Promise.all([
            axios.get(`${API_URL}/cryptos/market-data/${id}`),
            axios.get(`${API_URL}/cryptos/profile/${id}`)

        ])
            .then(([resMarketData, resProfile ]) => {
                setCryptoMarketData(resMarketData.data)
                setCryptoProfile(resProfile.data)
                setCryptoDataLoaded(true)
            })
    },[])

    return (
        <>
            {cryptoDataLoaded && (
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.headerInfo}>
                            <Text style={styles.name}>{cryptoProfile.name}</Text>
                            <Text style={styles.symbol}>{cryptoProfile.symbol}</Text>
                            <Text style={styles.price}>{`$ ${convert(cryptoMarketData.market_data.price_usd)}`}</Text>
                        </View>
                        <View style={styles.headerTagLine}>
                            <Text style={styles.line}>{cryptoProfile.profile.general.overview.tagline}</Text>
                        </View>
                    </View>
                    <View style={styles.priceChanges}>
                        <View style={styles.priceChangeRow}>
                            <Text style={styles.line}>Percent Change 1h</Text>
                            <Text style={styles.line}>
                            {` % ${convert(
                                cryptoMarketData.market_data.percent_change_usd_last_1_hour,
                            )}`}
                            </Text>
                        </View>
                        <View style={styles.priceChangeRow}>
                            <Text style={styles.line}>Percent Change 24h</Text>
                            <Text style={styles.line}>
                            {` % ${convert(
                                cryptoMarketData.market_data.percent_change_usd_last_24_hours,
                            )}`}
                            </Text>
                        </View>
                    </View>
                    <ScrollView style={styles.cryptoInfo}>
                        <View style={styles.cryptoInfoRow}>
                            <Text style={styles.cryptoInfoTitle}>Overview</Text>
                        </View>
                        <RenderHtml
                            contentWidth={width}
                            source={{ html: `<p style="color: #fff">${cryptoProfile.profile.general.overview.project_details}</p>`}}
                        />
                        <View style={styles.cryptoInfoRow}>
                            <Text style={styles.cryptoInfoTitle}>Background</Text>
                        </View>
                        <RenderHtml
                            contentWidth={width}
                            source={{ html: `<p style="color: #fff">${cryptoProfile.profile.general.background.background_details}</p>`}}
                        />
                    </ScrollView>
                </View>
            )}

            {!cryptoDataLoaded && (
                <ActivityIndicator size="large" color="#ffab00" />
            )}  
        </>
      );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#272d42",
        padding: 10,
        flex: 1
    },
    header: {
        backgroundColor: "#000",
        height: 100,
        padding: 10,
        borderRadius: 10,
        marginBottom: 15
    },
    headerInfo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    headerTagLine: {
        fontSize: 20,
        color: "#fff"
    },
    name: {
        fontSize: 24,
        color: "#fff"
    },
    symbol: {
        fontSize: 15,
        padding: 5,
        backgroundColor: "#272d42",
        color: "#fff"
    },
    price: {
        fontSize: 28,
        color: "#ffab00",
        width: 150,
        textAlign: 'right'
    },
    line: {
        color: "#fff",
        fontSize: 16,
        marginTop: 10
    },
    priceChanges: {
        backgroundColor: '#000',
        height: 75,
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
      },
      priceChangeRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      cryptoInfo: {
        backgroundColor: "#000",
        padding: 10,
        flex: 1,
        borderRadius: 10,
        marginBottom: 15
      },
      cryptoInfoTitle: {
        color: "#ffab00",
        fontSize: 22
      },
      cryptoInfoText: {
        color: "#fff",
        fontSize: 22
      },
      cryptoInfoRow: {
        flex: 1
      }



})

const convert = (price) => {
    return Math.round(price * 100) / 100
}

export default DetailScreen