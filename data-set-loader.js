scaleFactor = 1.1;

function scaleFactorUp() {
    scaleFactor = 1.2;
}

function scaleFactorDown() {
    scaleFactor = 0.8;
}

function onNode(state) {
    state.__sphere.scale.x *= scaleFactor;
    state.__sphere.scale.y *= scaleFactor;
    state.__sphere.scale.z *= scaleFactor;
}

function graphSet_jsonFileLoad(astr_jsonFileName) {
    // Simply return a graph set read from a json file

    return (function(Graph) {
        d3.json(astr_jsonFileName, Graph);
    })
}

function getGraphDataSets() {

    let l_graph = [
        'miserables',
        'cloud'
    ];

    let l_graphFunction = [];

    for (i in l_graph) {
        console.log(i);
        const funcObj = graphSet_jsonFileLoad(l_graph[i] + '.json');
        funcObj.description = "<em>" + l_graph[i] + "</em> topology";
        funcObj.uid = l_graph[i];
        l_graphFunction.push(funcObj);
    }

    return l_graphFunction;
}