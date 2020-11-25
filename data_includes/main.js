// This is a simple demo script, feel free to edit or delete it
// Find a tutorial and the list of availalbe elements at:
// https://www.pcibex.net/documentation/

PennController.ResetPrefix(null) // Shorten command names (keep this line here)
PennController.DebugOff();


// Show the 'intro' trial first, then the training items in random order
// Then comes the intermission
// The actual experiment presents the sentences randomly, with a break after N sentences.
// After that, send the results and finally show the trial labeled 'bye'.
//Sequence("intro", "instructions", "training", "intermission", sepWithN( "break" , randomize("experiment") , 4), SendResults(), "goodbye")
Sequence("intro", "experiment", SendResults(), "goodbye")

// What is in Header happens at the beginning of every single trial
Header(
    // We will use this global Var element later to store the participant's name
    newVar("ParticipantName")
        .global()
    ,
    // Delay of 250ms before every trial
    newTimer(750)
        .start()
        .wait()
)
.log( "Name" , getVar("ParticipantName") )
// This log command adds a column reporting the participant's name to every line saved to the results

newTrial( "intro" ,

    newText("<p><strong>Voluntary participation:</strong> I understand that my participation in this study is voluntary.<br/>" +
        "<strong>Withdrawal:</strong> I can withdraw my participation at any time during the experiment.<br/>"+
        "<strong>Risks:</strong> There are no risks involved.<br/>"+
        "<strong>Equipment:</strong> I am participating from a device with a <strong>physical keyboard</strong>.</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("Welcome to the A-maze demo.")
        .css("font-size", "1.5em")
        .center()
        .print()
    ,
    newButton("OK")
        .size(100)
        .center()
        .print()
        .wait()
    ,
    fullscreen()
) // intro message

newTrial("instructions" ,

    newText("<p>In this experiment, your task is to read sentences and provide an evaluation.<br/>" +
        "<b>Please make your choices as quickly and as accurately as possible.<br/>" +
        "There will be a few practice sentences to familiarize you with the task.</p>")
        .css("font-family", "Verdana")
        // .center()
        .print()
    ,
    newText("<p>Click OK when you are ready to begin.</p>")
        .css("font-family", "Verdana")
        .center()
        .print()
    ,
    newButton("OK")
        .size(100)
        .center()
        .print()
        .wait()
) // instructions

Template("sentences.csv", row =>
    newTrial("experiment",

        newController("AcceptabilityJudgment", row.Sentence)
            .print()
            .log()
            .wait()
        ,
        newScale(7)

        ,
        newTimer(500)
            .start()
            .wait()
    )
        // logs additional variables in sentence file (e.g., Fun)
        .log("Id", row.Id)
        .log("sentence", row.Sentence)
    ,
    newTrial("break",

        newText("<p>Well done, you've earned a little rest if you want.</p>" +
            "Press SPACE to continue.")
            .css("font-size", "1.5em")
            .css("font-family", "Verdana")
            .center()
            .log()
            .print()
        ,
        newKey(" ")
            .wait()
    )

) // defines template for the main experiment

SendResults("send") // send results to server before good-bye message

newTrial("goodbye",
    newText("<p>Thank you very much for your time and effort!</p>")
        .css("font-size", "1.5em")
        .css("font-family", "Verdana")
        .center()
        .print()
    ,
    newText("<a href='https://www.sfla.ch/'>Click here to validate your participation.</a>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .center()
        .print()
    ,
    newButton("void")
        .wait()
) // the good-bye message

.setOption( "countsForProgressBar" , false )
// Make sure the progress bar is full upon reaching this last (non-)trial
function SepWithN(sep, main, n) {
    this.args = [sep,main];

    this.run = function(arrays) {
        assert(arrays.length == 2, "Wrong number of arguments (or bad argument) to SepWithN");
        assert(parseInt(n) > 0, "N must be a positive number");
        let sep = arrays[0];
        let main = arrays[1];

        if (main.length <= 1)
            return main
        else {
            let newArray = [];
            while (main.length){
                for (let i = 0; i < n && main.length>0; i++)
                    newArray.push(main.pop());
                for (let j = 0; j < sep.length; ++j)
                    newArray.push(sep[j]);
            }
            return newArray;
        }
    }
}
function sepWithN(sep, main, n) { return new SepWithN(sep, main, n); }

_AddStandardCommands(function(PennEngine){
    this.test = {
        passed: function(){
            return !PennEngine.controllers.running.utils.valuesForNextElement ||
                !PennEngine.controllers.running.utils.valuesForNextElement.failed
        }
    }
});