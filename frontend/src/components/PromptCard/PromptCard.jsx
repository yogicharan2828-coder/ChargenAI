import "./PromptCard.css";

function PromptCard({
  promptRef,
  prompt,
  onPromptChange,
  onEnhance,
  onGenerate,
  loading,
}) {

  return (

    <div className="prompt-card">

      <h3>Describe what you want to create</h3>

      <textarea

        ref={promptRef}

        value={prompt}

        onChange={onPromptChange}

        placeholder="A futuristic city at sunset with flying cars and neon lights..."

      />

      <div className="prompt-actions">

        <button
          className="enhance-btn"
          onClick={onEnhance}
          disabled={loading}
        >
          ✨ Enhance Prompt
        </button>

        <span className="char-count">

          {prompt.length}/1000

        </span>

      </div>

      <div className="controls">

        <select>

          <option>Realistic</option>

          <option>Anime</option>

          <option>Cyberpunk</option>

        </select>

        <select>

          <option>16:9</option>

          <option>1:1</option>

          <option>9:16</option>

        </select>

        <select>

          <option>Flux</option>

          <option>SDXL</option>

        </select>

        <button

          className="generate-btn"

          disabled={loading}

          onClick={onGenerate}

        >

          {loading ? "Generating..." : "✨ Generate"}

        </button>

      </div>

    </div>

  );

}

export default PromptCard;