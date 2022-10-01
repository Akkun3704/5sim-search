import axios from 'axios'
import readline from 'readline'

const rl = readline.createInterface(process.stdin, process.stdout)

function print(...args) {
	console.log(...args)
}

async function getCountryList() {
	let { data } = await axios.get('https://5sim.net/v1/guest/countries')
	return Object.keys(data)
}

async function getProductList(country) {
	let { data } = await axios.get(`https://5sim.net/v1/guest/products/${country.toLowerCase()}/any`)
	return data
}

async function start() {
	let bestPrice = 1337, bestPriceCT = ''
	rl.question('What product you want to search? : ', async product => {
		product = (product || 'whatsapp').toLowerCase().trim()
		for (let country of await getCountryList()) {
			let data = await getProductList(country)
			print(country, data[product]?.['Price'])
			if (data[product]?.['Price'] < bestPrice) {
				bestPrice = data[product]?.['Price']
				bestPriceCT = country
			}
		}
		if (!bestPriceCT) {
			print('Sorry the product your searching is not founded')
			rl.close()
		} else {
			print('The best price is', bestPrice, '₽ from', bestPriceCT)
			rl.close()
		}
	})
}

start()
