export async function sendDiscordUpdate(message) {
    fetch(process.env.NEXT_PUBLIC_DISCORD_WEBHOOK, {        
        "method": "POST",
        "headers": { "Content-Type": "application/json" },
        "body": JSON.stringify({
            "content": '<@&957492337200754730> \n\n' + message + '\n\n https://wagmi-minimal-test.vercel.app/'
        })
    })
        .then(res => console.log(res))
        .catch(err => console.error(err));
}