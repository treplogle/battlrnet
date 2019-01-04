const idmap = {};

onmessage = function (e) {
    const type = e.data.type;
    const time = e.data.time;
    const id = e.data.id;

    switch (type) {
        case 'setInterval':
            idmap[id] = setInterval(function () {
                postMessage({ id: id });
            }, time);
            break;
        case 'clearInterval':
            clearInterval(idmap[id]);
            delete idmap[id];
            break;
        case 'setTimeout':
            idmap[id] = setTimeout(function () {
                postMessage({ id: id });
                if (idmap.hasOwnProperty(id)) {
                    delete idmap[id];
                }
            }, time);
            break;
        case 'clearTimeout':
            clearTimeout(idmap[id]);
            delete idmap[id];
            break;
    }
}