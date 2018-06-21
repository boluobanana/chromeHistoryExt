<template>
	<div class="Detail">
		<h1>detail</h1>
		<div class="container">

		</div>
	</div>
</template>
<script>

	export default {
		data: () => ({
			list
		}),
		components: {
		},
		computed: { },
		created () {

		},
		mounted () { },
		methods: { }
	}
</script>

<style lang="scss">
	.Detail {
		display: none;
		position: fixed;
		top: 0;
		height: 100%;
		width: 100%;
		background: rgba(0, 0, 0, 0.7);
		.container {
			background-color: #fff;
			width: 60vw;
			height: 80vh;
		}
	}
</style>