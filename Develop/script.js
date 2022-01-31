// set working hours - 9 to 5
var startHour = 9;
var endHour = 17;
var tasks = [];

$("#currentDay").text(moment().format("MMMM Do YYYY"));

var loadTasks = function() {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  
    // if nothing in localStorage, create a new object to track all task status arrays
    if (!tasks) {
      tasks = [];
      for(var i = startHour; i <= endHour; i++) {
        var newTask = {
            hour: i,
            content: ""
        };
        tasks.push(newTask);
      }
    }
  
    console.log(tasks);
    tasks.forEach(function(element) {
        addText(element.hour, element.content);
    });
};

var addText = function(hour, content) {
    $("[data-hour='" + String(hour) + "']").text(content);
};

// initialize the layout
var initializeLayout = function() {
    for(var i = startHour; i <= endHour; i++){
        var hourSlot = $("<div>").addClass("row d-flex justify-content-center hour-slot");
        var hour = $("<div>").addClass("col-2 h-100 border d-flex align-items-center justify-content-center");
        var taskSlot = $("<div>").addClass("col-9 border task-slot p-1");
        var saveBtn = $("<div>").addClass("col-1 border h-100 bg-success d-flex align-items-center justify-content-center save-btn");

        auditTime(i, taskSlot);
        taskSlot.attr("data-hour", String(i));

        if(i < 12) {
            hour.text(String(i) + "AM");
        }
        else if(i == 12) {
            hour.text("12PM");
        }
        else {
            hour.text(String(i % 12) + "PM");
        }

        saveBtn.text("💾");
        
        hourSlot.append(hour, taskSlot, saveBtn);
        $("#workday").append(hourSlot);
    }
}

var auditTime = function(i, taskSlot) {
    if(i < moment().get("hour")) {
        taskSlot.addClass("bg-light");
    }
    else if(i == moment().get("hour")) {
        taskSlot.addClass("bg-primary");
    }
    else {
        taskSlot.addClass("bg-info");
    }
};

// show text input
$("#workday").on("click", ".task-slot", function() {
    var text = $(this).text();
    var textInput = $("<textarea>").addClass("col-9 border p-1").val(text);
    textInput.attr("data-hour", $(this).attr("data-hour"));
    $(this).replaceWith(textInput);
    textInput.trigger("focus");
});

// save modified text
$("#workday").on("click", ".save-btn", function() {
    var textInput = $(this).prev();
    var hour = textInput.attr("data-hour");
    var taskSlot = $("<div>").addClass("col-9 border task-slot p-1");
    taskSlot.attr("data-hour", textInput.attr("data-hour"));
    

    auditTime(textInput.attr("data-hour"), taskSlot);
    console.log(textInput.val());
    tasks[hour-startHour] = {
        hour: hour,
        content: textInput.val()
    };
    localStorage.setItem("tasks", JSON.stringify(tasks));

    

    $(this).prev().replaceWith(taskSlot);
    addText(hour, textInput.val());
});

initializeLayout();
loadTasks();