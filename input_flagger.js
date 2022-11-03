

const __inputList = [
    "Euler a",
    "Euler",
    "LMS",
    "Heun",
    "DPM2",
    "DPM2 a",
    "DPM fast",
    "DPM adaptive",
    "LMS Karras",
    "DPM2 Karras",
    "DPM2 a Karras",
    "DDIM",
    "PLMS",
    "Negative prompt",
    "Prompt",
    "Width",
    "Height",
    "Restore faces",
    "Tiling",
    "Highres. fix",
    "Batch count",
    "Batch size",
    "CFG Scale",
    "Seed",
    "Mask blur",
    "Sampling Steps",
    "Draw mask",
    "Upload mask",
    "Inpaint masked",
    "Inpaint not masked",
    "fill",
    "original",
    "latent noise",
    "latent nothing",
    "Inpaint at full resolution",
    "Inpaint at full resolution padding, pixels",
    "Just resize",
    "Crop and resize",
    "Resize and fill",
    "Denoising strength"];
function findInput(labelElem) {
    var currentElem = labelElem.parentNode;
    while (currentElem && currentElem != document.body) {
        var input = currentElem.getElementsByTagName("input");
        var textarea = currentElem.getElementsByTagName("textarea");
        if (input[0]) return input[0];
        if (textarea[0]) return textarea[0];
        currentElem = currentElem.parentNode;
    }
    return null;
}
function findInput_id(root) {
    var text_base = root.innerText;
    var currentElem = root.parentNode;
    while (currentElem && currentElem != document.body) {
        if (currentElem.id && currentElem.id.substr(0, 3) == "tab")
            text_base += currentElem.id;
        else text_base += currentElem.className || currentElem.nodeName;;
        currentElem = currentElem.parentNode;
    }
    return btoa(text_base);
}
function getTxt(root) {
    var elems = root.childNodes, ret = "";
    for (var i = 0; i < elems.length; i++) {
        if (elems[i].nodeName == "#text") {
            ret += elems[i].textContent;
        }
    }
    return ret;
}
function PriorityQueue() {
    var queue = [];
    this.value = function () {
        return queue;
    };
    this.push = function (item) {
        if (this.isEmpty()) {
            queue.push(item);
        } else {
            var flag = false; //判断是否排队
            for (var i = 0; i < queue.length; i++) {
                if (queue[i].p < item.p) {
                    queue.splice(i, 0, item);
                    flag = true;
                    break;
                }
            }
            // 循环后未入队，优先级最大，插入到第一位
            if (!flag) {
                queue.push(item);
            }
        }
    };
    this.size = function () {
        return queue.length;
    };
    // 出队
    this.pop = function () {
        return queue.shift();
    };
    // 队列是否为空
    this.isEmpty = function () {
        return !queue.length;
    };
    // 队列第一个元素
    this.front = function () {
        return queue[0];
    };
    // 清空队列
    this.clear = function () {
        queue = [];
    };
}
function __flagElem(root,classN) {
    var que = new PriorityQueue(), p;
    que.push({ root: root, p: 0 });
    while (!que.isEmpty()) {
        root = que.front().root; p = que.pop().p;
        if (root.nodeName == "SCRIPT" || root.nodeName == "LINK" || root.nodeName == "STYLE") continue;
        if (root.nodeName == "SPAN" || root.nodeName == "LABEL") {
            if (__inputList.includes(getTxt(root))) {
                var input = findInput(root);
                if (input) {
                    UI_control[classN].push(input);
                    UI_control[classN + "_select"][getTxt(root)]=input;
                    input.setAttribute("data-auto-saver-id", findInput_id(root));
                    input.setAttribute("data-belongsId", getTxt(root));
                }
                console.log("[DA]:FIND-" + getTxt(root))
                continue;
            }
        }
        var elems = root.childNodes, flag = false;
        //console.log(root);
        for (var i = 0; i < elems.length; i++) {
            if (elems[i].nodeName == "#text") {
                flag = true;
            } else {
                que.push({ root: elems[i], p: p + 1 });
            }
        }
    }
}
function __list_input() {
    console.log("[UC]:INIT")
    __flagElem(gradioApp().querySelector("#tab_img2img"), "i2i");
    __flagElem(gradioApp().querySelector("#tab_txt2img"), "t2i");
    window.dispatchEvent(new Event("flagEnded"),UI_control)
}
function __input_setVal(elem, val) {
    let changed=false;
    if (elem.nodeName == 'TEXTAREA') {
        changed = (elem.value != val)
        elem.value = val;
    } else if (elem.nodeName == 'INPUT') {
        if (elem.type == 'radio' || elem.type == 'checkbox') {
            changed = (elem.checked != (val == "1" ? true : false));
            elem.checked = val == "1" ? true : false;
        } else {
            changed = (elem.value != val)
            elem.value = val;
        }
    }

    if (changed)
    elem.dispatchEvent(new InputEvent('change', { autoInnerEvent: true }));
    elem.dispatchEvent(new InputEvent('input', { autoInnerEvent: true }));
}
function __input_getVal(elem) {
    if (elem.nodeName == 'TEXTAREA') {
        return elem.value;
    } else if (elem.nodeName == 'INPUT') {
        if (elem.type == 'radio' || elem.type == 'checkbox') {
            return elem.checked ? "1" : "0";
        } else {
            return elem.value;
        }
    }
}

window.addEventListener("load", function () {
    function __loadCheck() {
        if (!gradioApp().querySelector("div.gradio-container > div.wrap.svelte-1ka70lm.cover-bg > div.m-12.z-20")) {
            __list_input();
        } else setTimeout(__loadCheck, 1000);
    }
    __loadCheck();
});


// 输入框
var UI_control = {
    t2i: [],
    i2i: [],
    t2i_select: {},
    i2i_select: {},
    set:__input_setVal,
    get:__input_getVal
}