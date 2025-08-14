import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

const App = () => {
  // --- STATE MANAGEMENT ---
  const [unitTitle, setUnitTitle] = useState('Electrical Installation and Safety Procedures');
  const [level, setLevel] = useState('Level 6');
  const [trainerName, setTrainerName] = useState('Alex Bett');
  const [numWeeks, setNumWeeks] = useState('12');
  const [numLessons, setNumLessons] = useState('3');
  const [curriculum, setCurriculum] = useState(
    `Unit Description: This unit covers the competencies required for planning, designing, and executing electrical installations with a strong emphasis on safety, compliance, and best practices. It includes everything from site evaluation and route identification to component selection, installation, and final evaluation.

Key Elements and Competencies:

1.  **Foundational Safety Principles:**
    - Introduction to Safety: Understand the importance of safety in electrical work.
    - Regulations and EHS: Define key terms and concepts related to EHS.
    - Occupational Health and Safety Standards: Apply standards and identify workplace hazards.
    - Good Housekeeping: Understand practices for a safe and clean workplace.
    - First Aid: Understand and demonstrate basic first aid procedures according to OSHA.

2.  **Planning and Site Evaluation:**
    - Accident and Incident Reporting: Identify procedures for reporting.
    - Site Suitability Survey and Evaluation: Conduct site evaluations according to established procedures.
    - Installation Route Identification: Identify suitable installation routes and understand factors affecting route selection.

3.  **Design and Measurement:**
    - Electrical Installation Design Basics: Understand principles and key considerations in design planning.
    - Measurements for Installation: Understand the importance of accurate measurements and practice taking them.
    - Survey Report Generation: Generate comprehensive survey reports and communicate findings.

4.  **Wiring and Structures:**
    - Wiring Types and Client Needs: Understand different wiring types and analyze client requirements.
    - Electrical Design for Different Structures: Apply design principles for various structure types according to IEE regulations.

5.  **Compliance and Component Management:**
    - Compliance with IEE Regulations: Understand and apply IEE regulations in electrical installations.
    - Interpretation of Installation Design Drawings: Develop skills in interpreting drawings, symbols, and nomenclatures.
    - Application of British Standards: Understand the importance of applying British Standards in electrical work.
    - Component Identification and Ratings: Identify electrical components and understand their ratings.

6.  **Technical Skills and Calculations:**
    - Drawing Tools and Techniques: Develop proficiency in using drawing tools for accurate preparation.
    - Calculation of Cable Sizes and Lengths: Learn methods for calculating cable sizes and lengths.
    - Power Supply and Distribution Circuits: Understand principles of power supply and distribution.
    - Phase Balancing Techniques: Learn and understand techniques for phase balancing.

7.  **Installation and Finalization:**
    - Indication of Cable Routes in Design: Develop skills in indicating cable routes accurately in drawings.
    - Preparation of Working Drawings: Learn methods for preparing accurate and detailed working drawings.
    - Load Estimation Techniques: Learn techniques for estimating electrical loads.
    - Protective Device Selection: Understand principles and learn methods for selecting appropriate protective devices.
    - Cable Sizing Calculations: Learn methods for calculating cable sizes based on estimated loads.
    - Record Keeping and Documentation: Understand the importance of accurate record-keeping.
    - Logistics Planning for Installation: Develop skills in planning logistics for installation projects.
    - Tools, Equipment, and Material Determination & Inspection: Learn methods for determining and inspecting needed materials.
    - Assembly and Acquisition: Develop skills in assembling tools/materials and acquiring installation drawings.
    - Scope Identification: Develop skills in identifying the scope of installation work.

8.  **Evaluation and Feedback:**
    - Reflect on learning, progress, and areas for improvement throughout the course.`
  );
  
  const [learningPlan, setLearningPlan] = useState('');
  const [sessionPlans, setSessionPlans] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [activeTab, setActiveTab] = useState('learningPlan');
  const [isApiConfigured, setIsApiConfigured] = useState(false);

  // --- API KEY CHECK ---
  useEffect(() => {
    // This check is designed to be safe in any environment. It verifies if the API_KEY
    // environment variable is accessible on the client-side.
    const keyIsAvailable = typeof process !== 'undefined' &&
                           typeof process.env !== 'undefined' &&
                           !!process.env.API_KEY;
    setIsApiConfigured(keyIsAvailable);
  }, []);

  // --- API CALL ---
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isApiConfigured) {
      setError("Configuration Error: The API_KEY is not available. Please ensure it is correctly configured in your deployment environment.");
      setWarning('');
      setLearningPlan('');
      setSessionPlans('');
      return;
    }

    setIsLoading(true);
    setError('');
    setWarning('');
    setLearningPlan('');
    setSessionPlans('');
    setActiveTab('learningPlan');

    const systemInstruction = `You are a CBET-compliant AI assistant trained in Kenya’s TVET CDACC standards. Your task is to generate a comprehensive Learning Plan and corresponding Session Plans based on the provided input data.

**TASK & OUTPUT FORMAT RULES:**

1.  **Generate a Learning Plan:**
    *   Create a single, complete HTML <table> with a <thead> and <tbody>. The table must have these columns: 'Week', 'Session No.', 'Session Title', 'Learning Outcome', 'Trainer Activities', 'Trainee Activities', 'Resources & Refs', 'Learning Checks/Assessments', 'Reflections & Date'.
    *   Distribute curriculum elements logically across the sessions based on the number of weeks and lessons per week.
    *   For the 'Learning Checks/Assessments' column, you MUST place a formal formative assessment (e.g., "Formative Assessment: Practical Test" or "Quiz on Element 1") in the last session that covers each major 'Key Element' from the curriculum. For all other intermediate sessions, use informal checks like 'Oral questioning', 'Observation', 'Group discussion'.

2.  **Generate Session Plans:**
    *   After the learning plan table, add a separator line containing only '---SESSION-PLANS---'.
    *   After the separator, generate a complete Session Plan for EACH session from the Learning Plan.
    *   Each session plan must use the exact HTML structure provided below. Fill in ALL bracketed placeholders \`[like this]\` and other details using the provided input data and the corresponding session information from the learning plan.
    *   Each session must have a total duration of 2 hours. Ensure the timings in the 'Session Delivery' table sum up to 120 minutes.

**Session Plan HTML Template:**
<div class="session-plan-container">
  <h2 class="session-plan-main-title">Session Plan</h2>
  <table class="session-plan-meta">
    <tbody>
      <tr>
        <td><strong>REF:</strong> [WeekNo]-[SessionNo]</td>
        <td><strong>Time:</strong> 2 Hours</td>
      </tr>
      <tr>
        <td><strong>Date:</strong></td>
        <td><strong>Class:</strong> [e.g., Full-Time Cohort]</td>
      </tr>
      <tr>
        <td><strong>Trainer name:</strong> [Insert Trainer's Name from Input]</td>
        <td><strong>Standard:</strong> TVET CDACC</td>
      </tr>
      <tr>
        <td><strong>Level:</strong> [Insert Level from Input]</td>
        <td></td>
      </tr>
      <tr>
        <td colspan="2"><strong>Unit Competence:</strong> [Insert Unit Title from Input]</td>
      </tr>
      <tr>
        <td colspan="2"><strong>Session title:</strong> [The Session Title from Learning Plan]</td>
      </tr>
      <tr>
        <td colspan="2"><strong>LLN or Other Requirements of learner (group):</strong> [e.g., Basic literacy, safety consciousness]</td>
      </tr>
      <tr>
        <td colspan="2"><strong>Learning outcome/s:</strong><br/>[The Learning Outcome from Learning Plan]</td>
      </tr>
      <tr>
        <td colspan="2"><strong>Resources (references and learning aids):</strong><br/>[Resources from Learning Plan]</td>
      </tr>
      <tr>
        <td colspan="2"><strong>Safety requirements:</strong><br/>[e.g., Adherence to workshop safety rules, use of PPE where necessary.]</td>
      </tr>
    </tbody>
  </table>
  <h3 class="session-presentation-title">Session Presentation</h3>
  <div class="session-section">
    <h4>1. Introduction</h4>
    <p>[A brief introduction for the session, e.g., Welcome trainees, review previous session, state current session objectives based on Learning Outcome.]</p>
  </div>
  <div class="session-section">
    <h4>2. Session Delivery</h4>
    <table class="session-delivery-table">
      <thead>
        <tr>
          <th>Time (in minutes)</th>
          <th>Trainer Activity</th>
          <th>Learner Activity</th>
          <th>Learning Check/Assessment</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>[e.g., 10]</td>
          <td>[e.g., Poses introductory questions to gauge prior knowledge.]</td>
          <td>[e.g., Respond to questions, participate in discussion.]</td>
          <td>[e.g., Oral questioning.]</td>
        </tr>
        <tr>
          <td>[e.g., 40]</td>
          <td>[e.g., Delivers a presentation/lecture on the session topic, using slides or whiteboard. Corresponds to Trainer Activities in Learning Plan.]</td>
          <td>[e.g., Listen, take notes, ask questions for clarification. Corresponds to Trainee Activities in Learning Plan.]</td>
          <td>[e.g., Observe engagement, clarify misconceptions. Corresponds to Learning Checks in Learning Plan.]</td>
        </tr>
        <tr>
          <td>[e.g., 50]</td>
          <td>[e.g., Demonstrates a practical skill and facilitates a hands-on activity.]</td>
          <td>[e.g., Practice the demonstrated skill individually or in groups.]</td>
          <td>[e.g., Observation checklist, assess practical output.]</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="session-section">
    <h4>3. Session review</h4>
    <p>[e.g., Summarizes the key take-aways, asks summary questions, and links to the next session.]</p>
  </div>
  <div class="assignment-box">
    <strong>Assignment:</strong>
    <p>[e.g., Read chapter 3 of the reference manual. / No assignment given.]</p>
  </div>
  <table class="session-plan-footer">
    <tbody>
      <tr>
        <td><strong>TOTAL TIME:</strong> 120 Minutes</td>
      </tr>
      <tr>
        <td><strong>Session reflection:</strong><br/><div class="reflection-space"></div></td>
      </tr>
      <tr>
        <td><strong>Signature:</strong><br/><div class="signature-space"></div></td>
      </tr>
    </tbody>
  </table>
</div>`;

    const userPrompt = `
      Generate the Learning Plan and Session Plans based on the following input data.

      **INPUT DATA:**
      * Unit Title: ${unitTitle}
      * Level: ${level}
      * Trainer Name: ${trainerName}
      * Number of Weeks: ${numWeeks}
      * Lessons per Week: ${numLessons}
      * Curriculum Details:
      ${curriculum}
    `;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemInstruction,
        }
      });

      let responseText = '';
      for await (const chunk of responseStream) {
        responseText += chunk.text;
      }

      const parts = responseText.split('---SESSION-PLANS---');
      
      if (parts.length === 2) {
        setLearningPlan(parts[0].trim());
        setSessionPlans(parts[1].trim());
      } else {
        console.warn("AI response did not contain the '---SESSION-PLANS---' separator.");
        setLearningPlan(responseText.trim());
        setSessionPlans('');
        setWarning("The AI response may be incomplete or improperly formatted. The '---SESSION-PLANS---' separator was not found. The full response is displayed under the 'Learning Plan' tab.");
      }

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please check your connection or API key.');
      setLearningPlan('');
      setSessionPlans('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!learningPlan) return;

    const fileName = `${unitTitle.replace(/ /g, '_')}_Learning_Plan.docx`;

    const sourceHTML = `
      <!DOCTYPE html>
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${unitTitle}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 12pt; }
          h1, h2, p { font-family: 'Arial', sans-serif; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid black; padding: 8px; text-align: left; vertical-align: top; }
          th { background-color: #f2f2f2; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Learning Plan</h1>
        <h2>Unit: ${unitTitle}</h2>
        <p><strong>Level:</strong> ${level}</p>
        <p><strong>Trainer:</strong> ${trainerName}</p>
        ${learningPlan}
      </body>
      </html>`;
    
    const blob = new Blob([sourceHTML], { type: 'application/vnd.ms-word' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleDownloadSessionPlans = () => {
    if (!sessionPlans) return;

    const fileName = `${unitTitle.replace(/ /g, '_')}_Session_Plans.docx`;

    const sourceHTML = `
      <!DOCTYPE html>
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${unitTitle} - Session Plans</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 11pt; }
          h1, h2, h3, h4, strong { font-family: 'Arial', sans-serif; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 15px; }
          th, td { border: 1px solid black; padding: 5px; text-align: left; vertical-align: top; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .session-plan-container { 
            page-break-after: always; /* Each plan on a new page */
            border: 1px solid black; 
            padding: 15px; 
            margin-bottom: 20px;
          }
          .session-plan-main-title { text-align: center; font-size: 16pt; font-weight: bold; margin-bottom: 15px; }
          .session-presentation-title { text-align: center; font-size: 12pt; font-weight: bold; background-color: #f2f2f2; padding: 5px; border: 1px solid black; border-bottom: none; }
          .session-section { border: 1px solid black; padding: 10px; margin-bottom: 10px; }
          .session-section h4 { font-size: 11pt; font-weight: bold; margin-bottom: 5px; }
          .assignment-box { border: 1px solid black; padding: 10px; margin-top: 10px; background-color: #f9f9f9; }
          .reflection-space, .signature-space { min-height: 50px; border: 1px dashed #ccc; margin-top: 5px; }
          .session-plan-footer td { border: 1px solid black; padding: 5px; }
          .session-plan-meta td { border: 1px solid black; padding: 5px; }
          .session-delivery-table th { text-align: left; background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>Session Plans</h1>
        <h2>Unit: ${unitTitle}</h2>
        <p><strong>Level:</strong> ${level}</p>
        <p><strong>Trainer:</strong> ${trainerName}</p>
        <br/>
        ${sessionPlans}
      </body>
      </html>`;
    
    const blob = new Blob([sourceHTML], { type: 'application/vnd.ms-word' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  // --- RENDER ---
  return (
    <>
      <style>{STYLES}</style>
      <div className="app-container">
        <aside className="sidebar">
          <header className="sidebar-header">
            <h1>TVET EduPlanner</h1>
            <p>AI-Powered Lesson Planning</p>
            <p className="creator-credit">Created by Mr Bett</p>
          </header>
          <form onSubmit={handleGenerate} className="input-form">
            <div className="form-group">
              <label htmlFor="unitTitle">Unit Title</label>
              <input type="text" id="unitTitle" value={unitTitle} onChange={(e) => setUnitTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="level">Level</label>
              <input type="text" id="level" value={level} onChange={(e) => setLevel(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="trainerName">Name of Trainer</label>
              <input type="text" id="trainerName" value={trainerName} onChange={(e) => setTrainerName(e.target.value)} required />
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="numWeeks">No. of Weeks</label>
                <input type="number" id="numWeeks" value={numWeeks} onChange={(e) => setNumWeeks(e.target.value)} required min="1" />
              </div>
              <div className="form-group">
                <label htmlFor="numLessons">Lessons/Week</label>
                <input type="number" id="numLessons" value={numLessons} onChange={(e) => setNumLessons(e.target.value)} required min="1" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="curriculum">Unit Curriculum Paste Area</label>
              <textarea id="curriculum" value={curriculum} onChange={(e) => setCurriculum(e.target.value)} rows={10} required></textarea>
            </div>
            {isApiConfigured ? (
              <button type="submit" className="generate-btn" disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Plan'}
              </button>
            ) : (
              <div className="error-message" style={{ marginTop: 'auto', textAlign: 'center' }}>
                <strong>Configuration Error:</strong><br />
                The <code>API_KEY</code> is not available. Please ensure it is configured in the deployment environment.
              </div>
            )}
          </form>
        </aside>

        <main className="main-content">
          {isLoading && <LoadingSpinner />}
          {error && <div className="error-message">{error}</div>}
          {warning && <div className="warning-message">{warning}</div>}
          
          {!isLoading && !learningPlan && !error && (
             <div className="placeholder">
                <div className="placeholder-icon">📄</div>
                <h2>Your Plans Await</h2>
                <p>Fill out the form on the left and click "Generate Plan" to see your customized learning materials appear here.</p>
             </div>
          )}

          {learningPlan && (
            <div className="results-container">
               <div className="tabs-bar">
                <div className="tabs">
                  <button 
                    className={`tab-btn ${activeTab === 'learningPlan' ? 'active' : ''}`}
                    onClick={() => setActiveTab('learningPlan')}
                    aria-pressed={activeTab === 'learningPlan'}
                  >
                    Learning Plan
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'sessionPlans' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sessionPlans')}
                    aria-pressed={activeTab === 'sessionPlans'}
                    disabled={!sessionPlans}
                  >
                    Session Plans
                  </button>
                </div>
                {activeTab === 'learningPlan' && learningPlan && (
                   <button onClick={handleDownload} className="download-btn-top" title="Download Learning Plan as .docx">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    <span>Download .docx</span>
                  </button>
                )}
                {activeTab === 'sessionPlans' && sessionPlans && (
                   <button onClick={handleDownloadSessionPlans} className="download-btn-top" title="Download Session Plans as .docx">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    <span>Download .docx</span>
                  </button>
                )}
              </div>

              <div className="tab-content">
                {activeTab === 'learningPlan' && (
                  <div className="html-output" dangerouslySetInnerHTML={{ __html: learningPlan }} />
                )}
                {activeTab === 'sessionPlans' && (
                  <div className="html-output" dangerouslySetInnerHTML={{ __html: sessionPlans }} />
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

const LoadingSpinner = () => (
    <div className="loading-spinner">
        <div className="spinner"></div>
        <p>AI is generating your plans... Please wait.</p>
    </div>
);

const STYLES = `
  :root {
    --bg-gradient: linear-gradient(135deg, #fce3ec, #fde4e4, #fce7de, #faead9, #f7ecd6, #f2f0d6, #eaf4d9, #e2f7de, #d8f9e7, #cffbf0, #c8fcf8, #c3fdff);
    --surface-color: rgba(255, 255, 255, 0.4);
    --border-color: rgba(255, 255, 255, 0.5);
    
    --primary-color: #2979ff;
    --secondary-color: #7c4dff;
    --accent-color: #ff4081;

    --text-primary: #1f2937;
    --text-secondary: #6b7280;
    --shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
    --font-family: 'Inter', sans-serif;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; font-family: var(--font-family); }
  body { 
    background-image: var(--bg-gradient);
    background-size: cover;
    background-attachment: fixed;
    color: var(--text-primary); 
    overflow: hidden;
  }

  .app-container {
    display: flex;
    height: 100%;
    padding: 1rem;
    gap: 1rem;
  }

  .sidebar {
    width: 450px;
    min-width: 400px;
    background: var(--surface-color);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    box-shadow: var(--shadow);
  }

  .sidebar-header {
    margin-bottom: 2rem;
    text-align: left;
  }
  .sidebar-header h1 {
    font-size: 1.8rem;
    font-weight: 700;
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .sidebar-header p {
    color: var(--text-secondary);
    font-size: 1rem;
  }
  .creator-credit {
    font-size: 0.8rem;
    color: var(--text-secondary);
    margin-top: 0.5rem;
    text-align: left;
  }
  
  .input-form { flex-grow: 1; display: flex; flex-direction: column; }
  .form-group { margin-bottom: 1.25rem; }
  .form-group label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
  }
  .form-group input, .form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    font-size: 1rem;
    font-family: var(--font-family);
    color: var(--text-primary);
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .form-group input::placeholder, .form-group textarea::placeholder {
      color: var(--text-secondary);
  }
  .form-group input:focus, .form-group textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(41, 121, 255, 0.2);
  }
  .form-group textarea { resize: vertical; }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .generate-btn {
    margin-top: auto;
    padding: 1rem;
    width: 100%;
    background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  .generate-btn:hover:not(:disabled) { 
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 64, 129, 0.3);
  }
  .generate-btn:active:not(:disabled) { 
    transform: translateY(0px);
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  .generate-btn:disabled { 
    background: var(--text-secondary);
    cursor: not-allowed; 
  }

  .main-content {
    flex: 1;
    background: var(--surface-color);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 2.5rem;
    overflow-y: auto;
    position: relative;
    box-shadow: var(--shadow);
  }
  
  .placeholder {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    text-align: center;
    color: var(--text-secondary);
  }
  .placeholder-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: #fff;
    box-shadow: 0 0 30px rgba(124, 77, 255, 0.4);
  }
  .placeholder h2 {
      color: var(--text-primary);
      margin-bottom: 0.5rem;
  }
  
  .error-message {
    background-color: rgba(255, 64, 129, 0.1);
    color: #c51162;
    padding: 1rem;
    border: 1px solid var(--accent-color);
    border-radius: 6px;
    margin-bottom: 1rem;
  }
  .error-message code {
    background-color: rgba(255, 64, 129, 0.1);
    padding: 0.1em 0.3em;
    border-radius: 4px;
    font-family: monospace;
  }

  .warning-message {
    background-color: rgba(255, 167, 38, 0.1);
    color: #e65100;
    padding: 1rem;
    border: 1px solid #ffab40;
    border-radius: 6px;
    margin-bottom: 1rem;
  }
  
  .loading-spinner {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10;
    border-radius: 16px;
  }
  .loading-spinner .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(0,0,0,0.1);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  .loading-spinner p { font-weight: 500; color: var(--text-primary); }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .results-container {
    animation: fadeIn 0.5s ease-in-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .tabs-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(0,0,0,0.1); 
    margin-bottom: 1.5rem;
  }
  .tabs { /* Now just a flex container for buttons */ }
  .tab-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-secondary);
    border-bottom: 3px solid transparent;
    margin-bottom: -1px; /* Overlap border */
    transition: color 0.2s, border-color 0.2s;
  }
  .tab-btn:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
  .tab-btn.active, .tab-btn:hover:not(:disabled) { color: var(--text-primary); }
  .tab-btn.active { border-bottom-color: var(--primary-color); }

  .download-btn-top {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s;
    white-space: nowrap;
  }
  .download-btn-top:hover {
    background-color: #1a66e0;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  .download-btn-top:active {
    transform: translateY(0);
    box-shadow: none;
  }
  .download-btn-top svg {
    width: 16px;
    height: 16px;
  }
  
  .html-output table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }
  .html-output th, .html-output td {
    border: 1px solid rgba(0,0,0,0.1);
    padding: 0.75rem;
    text-align: left;
    vertical-align: top;
  }
  .html-output th {
    background-color: rgba(255, 255, 255, 0.2);
    font-weight: 600;
    color: var(--text-primary);
  }
  .html-output tbody tr:nth-child(odd) {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .session-plan-container {
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    background: transparent;
    page-break-inside: avoid;
  }
  .session-plan-main-title {
    text-align: center;
    font-weight: 700;
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    text-transform: uppercase;
    color: var(--primary-color);
  }
  .session-plan-meta, .session-delivery-table, .session-plan-footer {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }
  .session-plan-meta td, .session-delivery-table th, .session-delivery-table td, .session-plan-footer td {
    border: 1px solid rgba(0,0,0,0.1);
    padding: 0.6rem;
    vertical-align: top;
  }
  .session-plan-meta strong {
    color: var(--text-secondary);
  }
  .session-delivery-table th {
    background-color: rgba(255, 255, 255, 0.2);
    font-weight: 600;
    text-align: left;
    color: var(--text-primary);
  }
  .session-presentation-title {
    text-align: center;
    font-weight: 600;
    background-color: rgba(255, 255, 255, 0.15);
    padding: 0.5rem;
    border: 1px solid rgba(0,0,0,0.1);
    border-bottom: none;
    margin-bottom: 0;
    border-radius: 6px 6px 0 0;
  }
  .session-section {
    padding: 0.75rem;
    border: 1px solid rgba(0,0,0,0.1);
    border-top: none;
    margin-bottom: 1rem;
  }
  .session-section:last-of-type {
    margin-bottom: 0;
    border-radius: 0 0 6px 6px;
  }
  .session-section h4 {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--primary-color);
  }
  .assignment-box {
    border: 1px solid rgba(0,0,0,0.1);
    padding: 0.75rem;
    margin-bottom: 1rem;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 6px;
  }
  .reflection-space, .signature-space {
    min-height: 40px;
    margin-top: 0.25rem;
    border: 1px dashed rgba(0,0,0,0.2);
    border-radius: 4px;
  }
  
  @media (max-width: 1024px) {
    body { overflow: auto; }
    .app-container { 
      flex-direction: column; 
      height: auto;
    }
    .sidebar { 
      width: 100%; 
      max-height: none;
      min-width: unset;
    }
  }
`;

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);