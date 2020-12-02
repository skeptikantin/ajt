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
Sequence("intro",
    "instructions",
    "training",
    "intermission",
    sepWithN("break", randomize("experiment"), 14),
    "debrief",
    SendResults(),
    "goodbye")

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
//.log( "Name" , getVar("ParticipantName") )
// This log command adds a column reporting the participant's name to every line saved to the results
.log("ParticipantID", PennController.GetURLParameter("participant") );

newTrial( "intro" ,

    newText("<p>Welcome!</p>")
        .css("font-size", "1.2em")
        .print()
    ,
    newText("<p><strong>Informed Consent</strong>:</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p><strong>Voluntary participation:</strong> I understand that my participation in this study is voluntary.<br/>" +
        "<strong>Withdrawal:</strong> I can withdraw my participation at any time during the experiment.<br/>"+
        "<strong>Risks:</strong> There are no risks involved.<br/>"+
        "<strong>Environment:</strong> I participate from a quiet environment and can work uninterrupted.</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>By clicking OK, you agree to the above. Let's get started!</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newButton("OK")
        .size(100)
        .center()
        .print()
        .wait()

) // intro message

newTrial("instructions" ,

    newText("<p>Your task is to judge sentences, one sentence at a time.<br/>"+
        "Some of them will make sense, some will make less or no sense.</p>"+
        "<p>Your task is to decide whether the sentence on screen makes sense or not,<br/>" +
        "that is, if the bold word goes with the sentence or not.</p>" +
        "<p>Select <strong>YES</strong>, if sentence makes sense, and <strong>NO</strong> if it doesn't.</p>" +
        "<p>Please try to be both accurate and quick.</p>" +
        "<p>We will start with 3 training sentences to illustrate the task.</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>Click OK when you are ready to begin.</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newButton("OK")
        .size(50)
        .center()
        .print()
        .wait()
) // instructions

Template("training.csv", row =>
        newTrial("training",

            newText("<p> </p>")
                .css("font-family", "Verdana")
                .print()
            ,
            newText("Sentence", row.Sentence)
                .css("font-size", "1.2em")
                .css("font-family", "Verdana")
                .print()
                .log()
            ,
            newScale("Judgement", "yes", "no")
                .settings.radio()
                .settings.labelsPosition("bottom")
                .settings.center()
                .print()
                .settings.log()
                .wait("")
            ,
            newTimer(500)
                .start()
                .wait()
        )
            // logs additional variables in sentence file (e.g., Fun)
            .log("Id", row.Id)
            .log("Sentence", row.Sentence)
            .log("Target", row.Target)
            .log("Condition", row.Condition)
            .log("Corr", row.Corr)
    //.log("judgement")
    )

// Intermission
newTrial("intermission",

    newText("<p>Well done, you should be good to go.<br/>" +
        "Remember: try to be quick <strong>and</strong> accurate.</p>" +
        "<p>You are now going to judge 42 sentences.<br/>" +
        "There will be a designated break every 14 sentences, if you want.<br/></p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("(Please do not take a break <em>while</em> reading/judging a sentence.)")
        .print()
    ,
    newText("<p>Click OK when you are ready to proceed to the main experiment.</p>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .print()
    ,
    newButton("OK")
        .size(50)
        .center()
        .print()
        .wait()
)

Template("main.csv", row =>
    newTrial("experiment",

        newText("<p> </p>")
            .css("font-family", "Verdana")
            .print()
        ,
        newText("Sentence", row.Sentence)
            .css("font-size", "1.2em")
            .css("font-family", "Verdana")
            .print()
            .log()
        ,
        newScale("Judgement", "yes", "no")
            .settings.radio()
            .settings.labelsPosition("bottom")
            .settings.center()
            .print()
            .settings.log()
            .wait("")
        ,
        newTimer(500)
            .start()
            .wait()
    )
        // logs additional variables in sentence file (e.g., Fun)
        .log("Id", row.Id)
        .log("Sentence", row.Sentence)
        .log("Target", row.Target)
        .log("Condition", row.Condition)
        .log("Corr", row.Corr)
        //.log("judgement")
    ,
    newTrial("break",

        newText("<p>Well done, you've earned a little rest if you want.</p>" +
            "Press SPACE to continue.")
            .css("font-family", "Verdana")
            .center()
            .log()
            .print()
        ,
        newKey(" ")
            .wait()
    )

) // defines template for the main experiment

newTrial("debrief",

    newText("<p>That's (almost) it, thank you!</p>")
        .css("font-size", "1.2em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>Before you go, would you mind providing us with feedback?<br/>" +
        "This information is voluntary, but will help us with the evaluation of the results.</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>What do you think the experiment was about?</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newTextInput("topic", "")
        .settings.log()
        .settings.lines(0)
        .settings.size(400, 100)
        .css("font-family", "Verdana")
        .print()
        .log()
    ,
    newText("<p>Did you read the sentences out lout?</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newScale("read", "yes", "sometimes", "no", "can't remember", "rather not say")
        .css("font-family", "Verdana")
        .settings.vertical()
        .print()
        .log()
    ,
    newText("<p> </p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newButton("send", "Send results & proceed to verification link")
        .size(300)
        .print()
        .wait()
)

SendResults("send") // send results to server before good-bye message

newTrial("goodbye",
    newText("<p>Thank you very much for your time and effort!</p>")
        .css("font-size", "1.2em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<strong><a href='https://www.sfla.ch/'>Click here to return to Prolific to validate your participation.</a></strong>")
        .css("font-size", "1em")
        .print()
    ,
    newText("<p><br/>You can contact the corresponding researcher <a href='https://www.sfla.ch/' target='_blank'>here</a> (opens new tab).</p>")
        .css("font-size", ".8em")
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