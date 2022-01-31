const tooltipDirective = (app) => {
	app.directive("tooltip", {
		mounted(el, binding) {
			init(el, binding);
		},
		updated(el, binding) {
			init(el, binding);
		}
	});
};

function init(el = {}, binding = {}) {
	// console.log('el', el)
	// console.log('binding', binding)
	let position = binding.arg || "top";
	let tooltipText = binding.value || "Tooltip";
	el.setAttribute("position", position);
	el.setAttribute("tooltip", tooltipText);
}

export default tooltipDirective;
