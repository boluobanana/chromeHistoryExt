<template>
	<div>
		<h1>Table</h1>
		<li v-for="item in list" :key="item.id" >
			{{item.domain}}： 访问次数{{item.visitCount}}
		</li>
	</div>
</template>
<script>
	import collect from '../lib/collect.js'

	var list = []

	const getList = async opt => {
		list = await collect(opt)

		return list
	}
	var whiteRule = [
		'translate.google.cn'
	]

	export default {
		data: () => ({
			list
		}),
		components: {
		},
		computed: { },
		async created () {
			this.list = await getList({
				whiteRule
			})
		},
		mounted () { },
		methods: { }
	}
</script>