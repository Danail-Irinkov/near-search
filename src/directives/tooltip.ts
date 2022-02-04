import {DirectiveBinding} from "vue";

const tooltipDirective = (app: any) => {
	app.directive("tooltip", {
		mounted(el: Element, binding: DirectiveBinding) {
			init(el, binding);
		},
		updated(el: Element, binding: DirectiveBinding) {
			init(el, binding);
		}
	});
};

function init(el: Element, binding: DirectiveBinding) {
	// console.log('el', el)
	// console.log('binding', binding)
	let position = binding.arg || "top";
	let tooltipText = binding.value || "Tooltip";
	el.setAttribute("position", position);
	el.setAttribute("tooltip", tooltipText);
}

export default tooltipDirective;
