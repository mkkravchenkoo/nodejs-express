document.querySelectorAll('.price').forEach(node => {
	node.textContent = new Intl.NumberFormat('us-US', {
		currency:'USD',
		style:'currency'
	}).format(node.textContent)
})