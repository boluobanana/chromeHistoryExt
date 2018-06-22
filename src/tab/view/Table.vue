<template>
	<div>
		<h1>Table</h1>
		<li v-for="item in list" :key="item.id">
			<span @click="e => openItem(e, item)" :key="item.id">
				{{item.domain}}： 访问次数{{item.visitCount}}
			</span>
		</li>
		<Detail v-if="isDetailVisible" v-bind:currentItem="currentItem" />
	</div>
</template>
<script>
	import collect from '../lib/collect.js'
	import Detail from './Detail.vue'
	var list = []

	const getList = async opt => {
		list = await collect(opt)

		return list
	}
	var whiteRule = [
		// 'translate.google.cn'
	]

	export default {
		data: () => ({
			list,
			isDetailVisible: false,
			currentItem: undefined
		}),
		components: {
			Detail
		},
		computed: { },
		async created () {
			this.list = await getList({
				whiteRule
			})
		},
		mounted () { },
		methods: {
			openItem (e, item) {
				this.currentItem = item
				this.isDetailVisible = true
			},
			closeItem () {
				this.currentItem = undefined
				this.isDetailVisible = false
			}
		}
	}
</script>