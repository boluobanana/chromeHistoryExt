<template>
	<div class="Detail" @click="close" data-close="true">
		<div class="container">
			<h1 @click="close">Detail</h1>
			<h2>Domain: <a target="_blank" :href="`http://${currentItem.domain}`" class="domain">{{currentItem.domain}}</a> VisitCount:{{currentItem.visitCount}}</h2>

			<ve-histogram :data="chartData" :events="chartEvents" :settings="chartSettings" ></ve-histogram>
			<ul>
				<li v-for="url in urls" :key="url.key">
					title: <span class="title" :title="url.title" >{{url.title}}</span>, time: <span class="time">{{url.visitDate}}-{{url.visitTime}}</span>, url: <a :href="url.url" class="link" :title="url.url">{{url.url}}</a>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
	import {getVisits} from '../lib/collect.js'

	export default {
		data () {
			return {
				history: {},
				urls: [],
				chartData: {
					columns: ['visitDate', 'count'],
					rows: []
				},
				chartEvents: {
					click: e => {
						let name = e.name

						this.urls = this.history[name].h
					}
				},
				chartSettings: {
					selectedMode: 'single',
					hoverAnimation: false
				}
			}
		},
		props: ['currentItem'],
		components: {
		},
		computed: { },
		async created () {
			// console.log(this.currentItem)
			let result = await getVisits(this.currentItem.h)
			result = splitByDay(result)
			result.out = sort(result.out)
			this.chartData.rows = result.out
			this.history = result.tmp

			// console.log(this.history)
		},
		mounted () { },
		methods: {
			close (e) {
				if (e.target.getAttribute('data-close') === 'true') {
					this.$parent.closeItem()
				}
			}
		}
	}

	function splitByDay (arr) {
		var tmp = {}

		arr.forEach(item => {
			tmp[item.visitDate] = tmp[item.visitDate] || {
				h: [],
				count: 0
			}

			let t = tmp[item.visitDate]

			t.h.push(item)
			t.count += 1
		})

		let out = []
		for (let k in tmp) {
			out.push({
				visitDate: k,
				count: tmp[k].count
			})
		}

		return {
			out, tmp
		}
	}

	function sort (arr) {
		arr.sort((a, b) => {
			if (a.visitDate > b.visitDate) {
				return -1
			} else {
				return 1
			}
		})

		return arr
	}
</script>

<style lang="scss">
	.Detail {
		// display: none;
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		justify-content: center;
		align-items: center;
		.container {
			background-color: #fff;
			width: 96vw;
			height: 80vh;
			overflow: scroll;
		}
		.domain {
			color: rgb(124, 253, 167);
		}
		.link {
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
			display: inline-block;
			max-width: 50%;
		}
		.title {
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
			display: inline-block;
			max-width: 30%;
		}
		.time {
			color: rgb(231, 165, 21)
		}
	}
</style>