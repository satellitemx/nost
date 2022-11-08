const random = (() => {
	return {
		generateInteger: () => Math.floor(Math.random() * 10000)
	}
})()

export default random