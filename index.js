// const Graph = ForceGraph3D()
//     (document.getElementById("2d-graph"));



let curDataSetIdx = null;
const dataSets = getGraphDataSets();

var svg = d3.select("svg");
var width = window.innerWidth;
var height = window.innerHeight;

var color = d3.scaleOrdinal(d3.schemeCategory20);

var b_labelsShow = false;
var graphLinks;
var graphNodes;
var graphNode_textAttributes;
var fcb_linksNodesLabels_show

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));


function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

function graphLinks_define(onGraph) {
    ret_linkvar = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(onGraph.links)
        .enter().append("line")
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); });
    console.log(onGraph.links);
    return (ret_linkvar);
}

function graphNodes_define(onGraph) {
    ret_node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(onGraph.nodes)
        .enter().append("circle")
        .attr("r", function(d) {
            if (typeof(d.radius) == 'undefined') {
                return 5;
            } else {
                return d.radius;
            }
        })
        .attr("fill", function(d) { return color(d.group); })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
    console.log('graph.nodes = ');
    console.log(onGraph.nodes);
    return (ret_node);
}

function nodes_setLabelsAndOpacity(onGraph, opacity) {
    return (
        svg.selectAll(".mytext")
        .data(onGraph.nodes)
        .enter()
        .append("text")
        .attr("id", function(d) {
            if (d.id.indexOf('link') == -1)
                return d.id;
            else
                return '';
        })
        .text(function(d) { return d.id; })
        .style("opacity", opacity)
        .style("text-anchor", "middle")
        .style("fill", "#555")
        .style("font-family", "Arial")
        .style("font-size", 12)
    );
}

function titleAdd(onNodes) {
    onNodes.append("title")
        .text(function(d) { return d.id; });
}

function onNodeClick_do(d) {
    console.log(d);
    console.log('clicked on node ' + d.id);
    console.log('labelsShow = ' + b_labelsShow);
}

function allNodesAttr_set(graphNodes, attr, value) {
    a_node = graphNodes._groups[0];
    for (let node of a_node) {
        str_id = node.__data__.id;
        d3.select('#' + str_id).style(attr, value);
    }
}

function fcb_linksNodesLabels_show() {
    graphLinks
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    graphNodes
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    graphNode_textAttributes
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });
}

function simulation_run(onGraph, fcb_tick) {
    simulation
        .nodes(onGraph.nodes)
        .on("tick", fcb_tick);
    simulation.force("link")
        .links(onGraph.links);
}

const Graph = function(error, graph) {
    if (error) throw error;

    graphLinks = graphLinks_define(graph);
    graphNodes = graphNodes_define(graph);
    graphNode_textAttributes = nodes_setLabelsAndOpacity(graph, 0);
    titleAdd(graphNodes);
    graphNodes.on("click", function(d) {
        b_labelsShow = !b_labelsShow;
        onNodeClick_do(d);
        if (b_labelsShow)
            allNodesAttr_set(graphNodes, 'opacity', 1);
        else
            allNodesAttr_set(graphNodes, 'opacity', 0);
    });
    simulation_run(graph, fcb_linksNodesLabels_show);
};

function getUrlParams(search) {
    let hashes = search.slice(search.indexOf('?') + 1).split('&')
    let params = {}
    hashes.map(hash => {
        let [key, val] = hash.split('=')
        params[key] = decodeURIComponent(val)
    })

    return params
}

function reloadPage(uid) {
    // trigger a page reload with new url
    const baseUrl = window.location.href.split("?uid=")[0];
    window.location = `${baseUrl}/?uid=${uid}`;
}

let toggleData = null;
(toggleData = function() {
    const uid = getUrlParams(window.location.search).uid;

    // try to find uid in list of datasets
    let currentIndex = null;
    let dataSet = null;
    for (let i = 0; i < dataSets.length; i++) {
        if (dataSets[i].uid === uid) {
            currentIndex = i;
        }
    }

    if (currentIndex === null) {
        // uid not found, load first dataset
        dataSet = dataSets[0];
        reloadPage(dataSet.uid);
    } else if (curDataSetIdx === null) {
        // uid found
        // and nothing previously cached (first load)
        curDataSetIdx = currentIndex;
        dataSet = dataSets[curDataSetIdx];
    } else if (curDataSetIdx === currentIndex) {
        // uid found
        // and something previously cached (user hits next)
        curDataSetIdx = (curDataSetIdx + 1) % dataSets.length;
        dataSet = dataSets[curDataSetIdx];
        reloadPage(dataSet.uid);
    }

    dataSet(Graph);
    document.getElementById('graph-data-description').innerHTML = dataSet.description ? `Viewing ${dataSet.description}` : '';

    var addEvent = document.addEventListener ? function(target, type, action) {
        if (target) {
            target.addEventListener(type, action, false);
        }
    } : function(target, type, action) {
        if (target) {
            target.attachEvent('on' + type, action, false);
        }
    }

    addEvent(document, 'keydown', function(e) {
        e = e || window.event;
        var key = e.which || e.keyCode;
        if (key === 87) {
            scaleFactorUp();
        }
        if (key === 83) {
            scaleFactorDown();
        }

    });

})(); // IIFE init