let currentThreadId = localStorage.getItem("travel_thread_id") || null;
let latestAnswerMarkdown = "";

function setPrompt(text) {
    const input = document.getElementById("userInput");
    input.value = text;
    input.focus();
}

function setLoading(loading) {
    const button = document.getElementById("sendBtn");
    const text = document.getElementById("btnText");
    const loader = document.getElementById("btnLoader");
    const arrow = document.getElementById("btnArrow");

    button.disabled = loading;

    if (loading) {
        text.classList.add("hidden");
        arrow.classList.add("hidden");
        loader.classList.remove("hidden");
    } else {
        text.classList.remove("hidden");
        arrow.classList.remove("hidden");
        loader.classList.add("hidden");
    }
}

function showError(message) {
    const box = document.getElementById("errorBox");
    box.textContent = message;
    box.classList.remove("hidden");
    box.scrollIntoView({ behavior: "smooth", block: "center" });
}

function hideError() {
    const box = document.getElementById("errorBox");
    box.textContent = "";
    box.classList.add("hidden");
}

function showResult(answer, threadId) {
    latestAnswerMarkdown = answer || "";
    const section = document.getElementById("resultSection");
    const box = document.getElementById("resultBox");
    const thread = document.getElementById("threadInfo");

    if (typeof marked !== "undefined") {
        box.innerHTML = marked.parse(latestAnswerMarkdown);
    } else {
        box.textContent = latestAnswerMarkdown;
    }

    thread.textContent = `Thread ID: ${threadId || "—"}`;
    section.classList.remove("hidden");

    setTimeout(() => {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
}

async function sendMessage() {
    hideError();

    const input = document.getElementById("userInput");
    const message = input.value.trim();

    if (!message) {
        showError("Tell Yatraa where you want to go first.");
        input.focus();
        return;
    }

    setLoading(true);

    try {
        const response = await fetch("/api/travel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message,
                thread_id: currentThreadId
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || "Yatraa could not generate your trip.");
        }

        currentThreadId = data.thread_id;
        localStorage.setItem("travel_thread_id", currentThreadId);

        showResult(data.answer, data.thread_id);
    } catch (error) {
        showError(error.message || "Something went wrong. Please try again.");
    } finally {
        setLoading(false);
    }
}

function newTrip() {
    currentThreadId = null;
    latestAnswerMarkdown = "";
    localStorage.removeItem("travel_thread_id");

    document.getElementById("userInput").value = "";
    document.getElementById("resultSection").classList.add("hidden");
    hideError();

    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById("userInput").focus();
}

async function copyResult() {
    const result = document.getElementById("resultBox");
    if (!result.innerText.trim()) return;

    try {
        await navigator.clipboard.writeText(result.innerText);
        const button = document.querySelector(".secondary-btn");
        const old = button.textContent;
        button.textContent = "Copied ✓";
        setTimeout(() => button.textContent = old, 1500);
    } catch {
        showError("Could not copy the travel plan.");
    }
}

function downloadPDF() {
    const content = document.getElementById("pdfContent");

    if (!latestAnswerMarkdown) {
        showError("Generate a travel plan before downloading the PDF.");
        return;
    }

    const button = document.querySelector(".primary-btn");
    const old = button.textContent;
    button.textContent = "Preparing…";
    button.disabled = true;

    const options = {
        margin: 0.45,
        filename: "yatraa-travel-plan.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff"
        },
        jsPDF: {
            unit: "in",
            format: "a4",
            orientation: "portrait"
        },
        pagebreak: { mode: ["css", "legacy"] }
    };

    html2pdf()
        .set(options)
        .from(content)
        .save()
        .then(() => {
            button.textContent = old;
            button.disabled = false;
        })
        .catch(() => {
            button.textContent = old;
            button.disabled = false;
            showError("Could not create the PDF.");
        });
}

document.getElementById("userInput").addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});
