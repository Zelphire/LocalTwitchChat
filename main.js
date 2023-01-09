const excludeList = ["streamelements"];
const messageLimit = 8; // number of messages that will be visible on screen.
options = { format: "default", themeMode: "light", scale: "1.0" };
const client = new tmi.Client({
  channels: ["dreamkeeperlumina"], // add twitch channel in array
});

client.connect();

client.on("message", (channel, tags, message, self) => {
  console.log({ channel, tags, message, self });
  // template for chat message html
  if (!excludeList.includes(tags.username)) {
    const li = `


    <div id=${tags.id} class="message-bubble" >
    <img src="MessageTopper.png"/>
      <div class="stack" style="--stacks: 3;">
      <span style="--index: 0;" class="chat-uname"> ${
        tags["display-name"]
      } :  </span> <span class="chat-text">${getEmotedMessage(
      encodeText(message),
      tags.emotes
    )}</span>
      </div>
      <img src="MessageBottomer.png"/>
    <div>
   `;

    $("#chat-box").prepend(li);

    // remove old message
    let checkValue = $(".message-bubble").overflowing("#chat-box");
    while (checkValue) {
      // elements are overflowing so remove old messages
      const elementsToRemove = $("#chat-box").find(
        `.message-bubble:last-of-type`
      );
      elementsToRemove.remove();
      checkValue = $(".message-bubble").overflowing("#chat-box");
    }
  }
});

function fadeChatMessage(id) {
  $(`#${id}`).fadeTo("slow", function () {
    //
  });
}

function removeChatMessage(id) {
  $(`#${id}`).slideUp("slow", function () {
    $(`#${id}`).remove();
  });
}
/**
 * Generates the emotes and injects it to message
 * @param {*} message
 * @param {*} emotes
 */
function getEmotedMessage(e, t) {
  if (!t) return e;
  const n = [];
  return (
    Object.entries(t).forEach(([t, s]) => {
      const o = s[0],
        [i, a] = o.split("-"),
        c = e.substring(parseInt(i, 10), parseInt(a, 10) + 1);
      let l =
        "<img src ='https://static-cdn.jtvnw.net/emoticons/v2/" +
        t +
        "/" +
        ((null == options ? void 0 : options.format) || "default") +
        "/" +
        ((null == options ? void 0 : options.themeMode) || "light") +
        "/" +
        ((null == options ? void 0 : options.scale) || "1.0") +
        "' class='twitch-emote'/>";
      n.push({ stringToReplace: c, replacement: l });
    }),
    n.reduce(
      (e, { stringToReplace: t, replacement: n }) => e.split(t).join(n),
      e
    )
  );
}

/**
 * This encode function is to prevent XSS attacks
 * @param {*} message
 */
function encodeText(message) {
  var lt = /</g,
    gt = />/g,
    ap = /'/g,
    ic = /"/g;
  return message
    .toString()
    .replace(lt, "&lt;")
    .replace(gt, "&gt;")
    .replace(ap, "&#39;")
    .replace(ic, "&#34;");
}
