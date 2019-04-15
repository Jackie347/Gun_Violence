var api = require('./neo4jApi');

$(function () {
    //renderGraph();
    searchGun();
    searchChar();
    //searchIncident();

    $("#searchIncident").submit(e => {
        e.preventDefault();
        searchIncident();
    });

    $("#GunFrequency").submit(e => {
        e.preventDefault();
        searchGunFrequency();
    });

    $("#GunCount").submit(e => {
        e.preventDefault();
        searchGunCount();
    });

    $("#CharFrequency").submit(e => {
        e.preventDefault();
        searchCharFrequency();
    });

    $("#CharCount").submit(e => {
        e.preventDefault();
        searchCharCount();
    });

    $("#IncidentFrequency").submit(e => {
        e.preventDefault();
        searchIncidentFrequency();
    });

});

// display incidents by city or state
function searchIncident() {
    console.log("funciton searchIncident is called");
    var city = $("#searchIncident").find("input[name=city]").val();
    var state = $("#searchIncident").find("input[name=state]").val();
    var order = $('input[name=exampleRadios]:checked', '#searchIncident').val();
    var limit = $("#searchIncident").find("input[name=limit]").val();
    limit = parseInt(limit);
    api
        .getIncident(city,state,order,limit)
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

// display gun type list
function searchGun() {
    console.log("funciton searchGun is called");
    api
        .getGun()
        .then(guns => {
            var t = $("select#guntypes").empty();

            if (guns) {
                guns.forEach(gun => {
                    //console.log(gun.gun);
                    $("<option value='"+ gun.gun +"'>" + gun.gun +"<option/>").appendTo(t)
                });
            }
        });
}

// select a gun type, display frequency by city or state
function searchGunFrequency() {
    console.log("funciton searchGunFrequency is called");
    var gun = $("#GunFrequency").find("option:selected").val();
    var filter = $('input[name=exampleRadios]:checked', '#GunFrequency').val();
    api
        .getGunFrequency(gun,filter)
        .then(frequencies => {
            var k = $("table#results2 thead").empty();
            if (filter == 'city') {
                $("<th>City or County</th><th>Gun Type Frequency</th>").appendTo(k);
            } else {
                $("<th>State</th><th>Gun Type Frequency</th>").appendTo(k);
            }
            var t = $("table#results2 tbody").empty();

            if (frequencies) {
                frequencies.forEach(frequency => {
                    $("<tr><td>"+ frequency.filter + "</td><td>" + frequency.frequency + "</td></tr>>").appendTo(t)
                });
            }
        });
}

// select a city or a state, display all gun type frequencies
function searchGunCount() {
    console.log("funciton searchGunCount is called");
    var city = $("#GunCount").find("input[name=city]").val();
    var state = $("#GunCount").find("input[name=state]").val();
    api
        .getGunCount(city,state)
        .then(counts => {
            var t = $("table#results3 tbody").empty();

            if (counts) {
                counts.forEach(count => {
                    $("<tr><td>"+ count.gun + "</td><td>" + count.count + "</td></tr>>").appendTo(t)
                });
            }
        });

}

// display characteristic type list
function searchChar() {
    console.log("funciton searchChar is called");
    api
        .getChar()
        .then(chars => {
            var t = $("select#chartypes").empty();

            if (chars) {
                chars.forEach(char => {
                    //console.log(gun.gun);
                    $("<option value='"+ char.characteristic +"'>" + char.characteristic +"<option/>").appendTo(t)
                });
            }
        });
}

function searchCharFrequency() {
    console.log("funciton searchCharFrequency is called");
    var char = $("#CharFrequency").find("option:selected").val();
    var filter = $('input[name=exampleRadios]:checked', '#CharFrequency').val();
    api
        .getCharFrequency(char, filter)
        .then(frequencies => {
            var k = $("table#results4 thead").empty();
            if (filter == 'city') {
                $("<th>City or County</th><th>Characteristic Type Frequency</th>").appendTo(k);
            } else {
                $("<th>State</th><th>Characteristic Type Frequency</th>").appendTo(k);
            }

            var t = $("table#results4 tbody").empty();
            if (frequencies) {
                frequencies.forEach(frequency => {
                    $("<tr><td>"+ frequency.filter + "</td><td>" + frequency.frequency + "</td></tr>>").appendTo(t)
                });
            }
        });
}

// select a city or a state, display all characteristics type frequencies
function searchCharCount() {
    console.log("funciton searchCharCount is called");
    var city = $("#CharCount").find("input[name=city]").val();
    var state = $("#CharCount").find("input[name=state]").val();
    api
        .getCharCount(city,state)
        .then(counts => {
            var t = $("table#results5 tbody").empty();

            if (counts) {
                counts.forEach(count => {
                    $("<tr><td>"+ count.char + "</td><td>" + count.count + "</td></tr>>").appendTo(t)
                });
            }
        });

}

function searchIncidentFrequency() {
    console.log("funciton searchCharFrequency is called");
    var filter = $('input[name=exampleRadios]:checked', '#IncidentFrequency').val();
    api
        .getIncidentFrequency(filter)
        .then(frequencies => {
            var k = $("table#results6 thead").empty();
            if (filter == 'city') {
                $("<th>City or County</th><th>Incident Frequency</th>").appendTo(k);
            } else {
                $("<th>State</th><th>Incident Frequency</th>").appendTo(k);
            }

            var t = $("table#results6 tbody").empty();
            if (frequencies) {
                frequencies.forEach(frequency => {
                    $("<tr><td>"+ frequency.filter + "</td><td>" + frequency.frequency + "</td></tr>>").appendTo(t)
                });
            }
        });
}


/*
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
}*/
