function loadData() {
    $.get('/signal', function (signal) {
        chart.data = signal
        chart.validateData();
    });
}
function acceleration(){
  $.get('/gradient', function(array_aceleration){
    chart.data = array_aceleration;
    chart.validateData();
  })
}
function integration(){
  $.get('/integration', function(array_aceleration){
    chart.data = array_aceleration;
    chart.validateData();
  })
}
var chart, charty, chartz;
am4core.ready(function () {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    chart = am4core.create("chartdivx", am4charts.XYChart);

 // Create axes
var categoryAxis = chart.xAxes.push(new am4charts.DateAxis());
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.renderer.minGridDistance = 30;


// Create series
function createSeriesAndAxis(field, name, topMargin, bottomMargin) {
  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  
  var series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = field;
  series.dataFields.dateX = "t";
  series.name = name;
  series.tooltipText = "{dateX}: [b]{valueY}[/]";
  //series.strokeWidth = 2;
  series.yAxis = valueAxis;
  
  //valueAxis.renderer.line.strokeOpacity = 1;
  //valueAxis.renderer.line.stroke = series.stroke;
  //valueAxis.renderer.grid.template.stroke = series.stroke;
  //valueAxis.renderer.grid.template.strokeOpacity = 0.1;
  //valueAxis.renderer.labels.template.fill = series.stroke;
  //valueAxis.renderer.minGridDistance = 20;
  //valueAxis.align = "right";
  //valueAxis.max = 100;
  //valueAxis.min = -100;
  
  if (topMargin && bottomMargin) {
    valueAxis.marginTop = 10;
    valueAxis.marginBottom = 10;
  }
  else {
    if (topMargin) {
      valueAxis.marginTop = 20;
    }
    if (bottomMargin) {
      valueAxis.marginBottom = 20;
    }
  }
  
  //var bullet = series.bullets.push(new am4charts.CircleBullet());
  //bullet.circle.stroke = am4core.color("#fff");
  //bullet.circle.strokeWidth = 2;
}

createSeriesAndAxis("x", "axis x", false, true);
createSeriesAndAxis("y", "axis y", true, true);
createSeriesAndAxis("z", "axis z", true, false);

chart.legend = new am4charts.Legend();
chart.cursor = new am4charts.XYCursor();

chart.leftAxesContainer.layout = "vertical";



}); // end am4core.ready()