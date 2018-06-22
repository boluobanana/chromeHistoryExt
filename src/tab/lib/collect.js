import moment from 'moment'

function collect (arr) {
	let output = {}

	arr.forEach((item, index) => {
		let domain = item.domain

		if (!domain) return item
		output[domain.hostname] = output[domain.hostname] || {
			h: [],
			formatDate: {},
			visitCount: 0
		}

		let t = output[domain.hostname]
		t.visitCount += item.visitCount
		t.key = index
		formatLastTime(item)
		t.h.push(item)
	})

	let outputArray = []

	for (let k in output) {
		outputArray.push(Object.assign({
			domain: k
		}, output[k]))
	}

	return outputArray
}
const main = (opt = {}) => {
	let
		startTime = opt.startTime || +new Date() - 30 * 24 * 60 * 60 * 1000,
		endTime = opt.endTime || +new Date(),
		maxResults = opt.maxResults || 10240,
		whiteRule = opt.whiteRule || []

	return new Promise(resolve => {
		chrome.history.search({ text: '', maxResults, startTime, endTime }, results => {
			results.map(item => {
				item.domain = getDomain(item.url)

				return item
			})

			results = collect(results)

			results = results.filter(item => whiteRule.indexOf(item.domain) === -1)
			results.sort((a, b) => b.visitCount - a.visitCount)

			resolve(results)
		})
	})
}

function getDomain (url) {
	let r = /((http|ftp|https):\/\/)(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,4})*(\/[a-zA-Z0-9\&%_\.\/-~-]*)?/.exec(url)

	if (r) {
		return {
			protocol: r[2], // http ftp https
			hostname: r[3], // ip or domain
			domain: r[4], // domain www.aaa.com
			ip: r[5], // 1.1.1.1
			port: r[6], // 80
			pathname: r[7] // /xxxxx/path/
		}
	} else {
		return undefined
	}
}
function formatLastTime (item) {
	let time = item.lastVisitTime

	item.lastDate = moment(time).format('MM.DD')
	item.lastTime = moment(time).format('HH:mm:ss')
}
function formatVisitTime (item) {
	let time = item.visitTime

	item.visitDate = moment(time).format('MM.DD')
	item.visitTime = moment(time).format('HH:mm:ss')
}
export const getVisits = async arr => {
	let out = []

	var promises = arr.map(item => {
		return new Promise(resolve => {
			chrome.history.getVisits({
				url: item.url
			}, visitItems => {
				visitItems.sort((a, b) => b.visitTime - a.visitTime)
				visitItems.forEach(t => {
					t.title = item.title
					t.url = item.url
					formatVisitTime(t)
				})
				out = out.concat(visitItems)
				resolve(true)
			})
		})
	})

	await Promise.all(promises)
	return out
}

export default main
