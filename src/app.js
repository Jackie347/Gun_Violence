var api = require('./neo4jApi');

$(function () {
    renderGraph();
    searchIncident();

    $("#searchIncident").submit(e => {
        e.preventDefault();
        searchIncident();
    });
});

// 展示某个州/城市/州和城市的枪击事件
function searchIncident() {
    console.log("funciton searchIncident is called");
    var city = $("#searchIncident").find("input[name=city]").val();
    //console.log("city_or_county" + city);
    var state = $("#searchIncident").find("input[name=state]").val();
    //console.log("state" + state);
        api
        .getIncident(city,state)
        .then(incidents => {
            var t = $("table#results1 tbody").empty();

            if (incidents) {
                incidents.forEach(incident => {
                    $("<tr><td class='movie'>" + incident.id + "</td><td>" + incident.date + "</td><td>"
                        + incident.address + "</td><td>" + incident.state + "</td><td>"
                        + incident.city_or_county + "</td><td>"+ incident.n_killed + "</td><td>"
                        + incident.n_injured + "</td><td>" + incident.n_guns_involved +"</td></tr>").appendTo(t)
                });
            }
        });
}


function renderGraph() {
    var width = 800, height = 800;
    var force = d3.layout.force()
        .charge(-200).linkDistance(30).size([width, height]);

    var svg = d3.select("#graph").append("svg")
        .attr("width", "100%").attr("height", "100%")
        .attr("pointer-events", "all");

    api
        .getGraph()
        .then(graph => {
            force.nodes(graph.nodes).links(graph.links).start();

            var link = svg.selectAll(".link")
                .data(graph.links).enter()
                .append("line").attr("class", "link");

            var node = svg.selectAll(".node")
                .data(graph.nodes).enter()
                .append("circle")
                .attr("class", d => {
                    return "node " + d.label
                })
                .attr("r", 10)
                .call(force.drag);

            // html title attribute
            node.append("title")
                .text(d => {
                    return d.title;
                });

            // force feed algo ticks
            force.on("tick", () => {
                link.attr("x1", d => {
                    return d.source.x;
                }).attr("y1", d => {
                    return d.source.y;
                }).attr("x2", d => {
                    return d.target.x;
                }).attr("y2", d => {
                    return d.target.y;
                });

                node.attr("cx", d => {
                    return d.x;
                }).attr("cy", d => {
                    return d.y;
                });
            });
        });
}
