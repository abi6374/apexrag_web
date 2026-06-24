import React, { useState } from 'react';
import { 
  Network, 
  ArrowRight, 
  Copy, 
  Check, 
  Cpu, 
  Binary, 
  GitBranch, 
  History, 
  ShieldCheck, 
  Activity, 
  Folder, 
  FileText, 
  Table, 
  AlignLeft, 
  Play, 
  Radio, 
  ShieldAlert, 
  XCircle, 
  CheckCircle,
  Terminal,
  Layers,
  Database,
  Search
} from 'lucide-react';

// Custom inline SVG for GitHub brand icon (since brands were deprecated in recent Lucide versions)
const GithubIcon = (props) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

function App() {
  // ── Dynamic Custom Installer Matrix State (vLLM style) ───────────────────
  const [release, setRelease] = useState('stable');
  const [provider, setProvider] = useState('openai');
  const [telemetry, setTelemetry] = useState('no');
  const [installCopied, setInstallCopied] = useState(false);

  const getInstallCommand = () => {
    let extras = [];
    if (provider === 'all') {
      extras.push('all');
    } else {
      if (provider === 'anthropic') extras.push('anthropic');
      if (provider === 'groq') extras.push('groq');
      if (provider === 'ollama') extras.push('ollama');
    }
    if (telemetry === 'yes') {
      extras.push('telemetry');
      extras.push('web');
    }
    
    if (extras.length > 0) {
      return `pip install "apex-rag[${extras.join(',')}]"`;
    }
    return 'pip install apex-rag';
  };

  const copyInstallCommand = () => {
    navigator.clipboard.writeText(getInstallCommand());
    setInstallCopied(true);
    setTimeout(() => setInstallCopied(false), 2000);
  };

  // ── Interactive Agent Loop Visualizer State (Haystack style) ───────────────
  const [activeStep, setActiveStep] = useState(0);
  const visualizerLogs = [
    'Waiting to execute query...',
    '[PLANNING] QueryPlannerAgent analyzing: Compare Q2 and Q3 metrics...',
    '[PLANNING] Deconstructed to: 1. Fetch Q2 financials, 2. Fetch Q3 financials',
    '[DET_RETRIEVE] Filtering AST down to top branches using FTS5 index...',
    '[DET_RETRIEVE] Target candidate outline paths located: refs/headings/financials',
    '[NAVIGATION] ASTNavigationAgent: Exploring Node 2.1 (Q2 Metrics)...',
    '[NAVIGATION] Navigator reading Semantic Map summaries: Found matching columns',
    '[VERIFY] StrictLeafVerifier: Verifying Node 2.1.3 content accuracy...',
    '[VERIFY] Result: Nodes confirmed as exact matches [Leaf: Paragraph].',
    '[AUDIT] EvaluationCriticAgent evaluating aggregate context plan...',
    '[AUDIT] Conformal coverage validated: Guarantee score 94.2% >= 90.0% target.',
    '[SYNTHESIS] Synthesizing final answer with direct AST citations.'
  ];
  
  const agentSteps = [
    { title: 'User Input', desc: 'A complex, multi-hop question is submitted to the ApexIndex facade.' },
    { title: '1. Query Planning', desc: 'The QueryPlannerAgent breaks the input into discrete, structural search instructions.' },
    { title: '2. Deterministic Filter', desc: 'BM25 and outline overlap index locate candidate nodes, preventing raw LLM search waste.' },
    { title: '3. Agentic Navigation', desc: 'The ASTNavigationAgent walks down Outline, Heading, and Section layers of the tree.' },
    { title: '4. Leaf Verification', desc: 'The StrictLeafVerifier validates the final data node answers the query directly.' },
    { title: '5. Evaluation Audit', desc: 'The EvaluationCriticAgent evaluates answer coverage against plan and conformal prediction layers.' }
  ];

  // ── Outline Document Tree Selector State (NumPy style) ────────────────────
  const [activeNode, setActiveNode] = useState('ROOT');
  const treeNodes = {
    'ROOT': { title: 'Annual_Report.pdf (Doc Root)', type: 'Document', summary: 'Global entry node. Contains outline paths for Sections 1 and 2.' },
    'SEC1': { title: 'Section 1: Executive Summary', type: 'Heading', summary: 'Outlines Q2-Q3 revenue, strategic milestones, and pipeline updates.' },
    'SEC2': { title: 'Section 2: Financial Metrics', type: 'Heading', summary: 'Detail statement tables representing operational expenditures, balances, and growths.' },
    'TAB2.1': { title: 'Table 2.1: Performance Balance Sheet', type: 'Table', summary: 'Structured spreadsheet grid indexing net earnings. Relates to Section 2.' },
    'PAR2.2': { title: 'Paragraph 2.2: Explanatory Growth notes', type: 'Paragraph', summary: 'Footnote explaining the 15.4% Q3 revenue calculations.' }
  };

  // ── Code Playground State ────────────────────────────────────────────────
  const [codeTab, setCodeTab] = useState('quick');
  const [codeCopied, setCodeCopied] = useState(false);

  const codeSnippets = {
    'quick': `import asyncio
from apex_rag import ApexIndex

async def main():
    # 1. Initialize ApexIndex (defaults to Ollama / OpenAI)
    async with await ApexIndex.create(provider="openai", model="gpt-4o") as index:
        
        # 2. Ingest document (converts to AST, builds graph, embeds)
        doc_id = await index.ingest("annual_report.pdf")
        
        # 3. Query (runs Planner -> Navigator -> Critic agent loop)
        answer = await index.query("What is the Q3 revenue change?", doc_id)
        
        print(answer.answer_text)
        print(f"Confidence Guarantee: {answer.coverage_guarantee * 100:.1f}%")

if __name__ == "__main__":
    asyncio.run(main())`,
    'stream': `import asyncio
from apex_rag import ApexIndex

async def main():
    async with await ApexIndex.create() as index:
        # Stream response tokens in real-time
        async for token in index.stream_query("Compare Q2 and Q3 revenue", doc_id="finance-1"):
            print(token, end="", flush=True)

if __name__ == "__main__":
    asyncio.run(main())`,
    'temporal': `from datetime import datetime, timezone
from apex_rag import ApexIndex

# Query the document state as it existed at a specific time
result = await index.temporal_query(
    question="What is the active product pricing?",
    doc_id="product-policy-v2",
    as_of=datetime(2025, 6, 1, tzinfo=timezone.utc)
)
print(result["result"])  # The resolved text answer
print(result["provenance"])  # Version lineage outline`,
    'rbac': `from apex_rag import ApexIndex, TenantContext

tenant_ctx = TenantContext(
    tenant_id="enterprise-co",
    user_id="user_948",
    roles=["FinanceManager"]
)

# Secure query with role-aware validation and content masking
answer = await index.role_aware_query(
    question="Summarize executive bonuses",
    doc_id="staff_salaries_2025",
    tenant_context=tenant_ctx
)
print(answer.answer_text)`,
    'graph': `import networkx as nx
from apex_rag import ApexIndex

# Retrieve direct causal relationship graph
graph: nx.DiGraph = await index.get_causal_graph()

for u, v, data in graph.edges(data=True):
    print(f"[{u}] --({data['type']})--> [{v}]")`
  };

  const copyCodePlayground = () => {
    navigator.clipboard.writeText(codeSnippets[codeTab]);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <div className="bg-slate-950 text-slate-100 font-sans antialiased min-h-screen relative overflow-x-hidden dot-grid">
      
      {/* Top Glowing Blur Decorator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] hero-glow pointer-events-none z-0"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/85 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Network className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">ApexRAG</span>
              <span className="text-[10px] block font-mono text-indigo-400 -mt-1 font-semibold">v1.0.3</span>
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#visualizer" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Agent Workflow</a>
            <a href="#explorer" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">AST Outliner</a>
            <a href="#playground" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Code Examples</a>
            <a href="#comparisons" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Comparisons</a>
            <a href="#installer" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Installation</a>
          </nav>
          <div className="flex items-center gap-3">
            <a 
              target="_blank" 
              rel="noopener noreferrer" 
              href="https://github.com/abinivas-17/apex-rag" 
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-sm font-medium hover:bg-slate-800 hover:text-white transition-all hover:scale-105"
            >
              <GithubIcon className="h-4 w-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-semibold text-indigo-400">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-ping"></span>
              <span>Multi-Agent Structural RAG Engine</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-white">
              Stop Guessing with Vectors.<br/>
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-teal-400 bg-clip-text text-transparent">Navigate with Agents.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              ApexRAG structures documents into a strict <strong className="text-slate-200">Universal AST</strong> outlines and deploys an orchestrator of coordinate agents (Planner, Navigator, Critic) to query outlines logically, delivering pinpoint accuracy with conformal confidence guarantees.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a href="#playground" className="px-6 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95">
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-lg overflow-hidden pr-2">
                <span className="px-4 py-3 font-mono text-sm text-indigo-400 bg-slate-950/40 border-r border-slate-800 select-all">$ pip install apex-rag</span>
                <button onClick={copyInstallCommand} className="p-2 text-slate-400 hover:text-white transition-colors" title="Copy command">
                  {installCopied ? <Check className="h-4 w-4 text-teal-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            {/* Glassmorphic Mock IDE/Terminal */}
            <div className="glow-border rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-2xl p-6 relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                </div>
                <span className="font-mono text-xs text-slate-500">quick_start.py</span>
              </div>
              <div className="pt-4 font-mono text-sm leading-relaxed text-indigo-200 overflow-x-auto code-scrollbar">
                <span className="text-purple-400">from</span> {"apex_rag "} <span className="text-purple-400">import</span> {"ApexIndex"}<br/><br/>
                <span className="text-slate-500"># 1. Initialize with OpenAI/Ollama</span><br/>
                <span className="text-teal-400">index</span> = <span className="text-purple-400">await</span> {"ApexIndex."}<span className="text-blue-400">create</span>(provider=<span className="text-amber-400">"openai"</span>)<br/><br/>
                <span className="text-slate-500"># 2. Ingest document structurally</span><br/>
                <span className="text-teal-400">doc_id</span> = <span className="text-purple-400">await</span> {"index."}<span className="text-blue-400">ingest</span>(<span className="text-amber-400">"annual_report.pdf"</span>)<br/><br/>
                <span className="text-slate-500">{"# 3. Query (Planner -> Navigator -> Critic)"}</span><br/>
                <span className="text-teal-400">answer</span> = <span className="text-purple-400">await</span> {"index."}<span className="text-blue-400">query</span>(<span className="text-amber-400">"What is Q3 growth?"</span>, doc_id)<br/><br/>
                <span className="text-blue-400">print</span>(answer.<span class="text-teal-400">answer_text</span>)<br/>
                <span className="text-blue-400">print</span>(answer.<span class="text-teal-400">coverage_guarantee</span>)<br/>
                <span className="text-slate-500"># &gt; "Q3 growth was 15.4% [Node: Section 2.1]"</span><br/>
                <span className="text-slate-500"># &gt; "Confidence Guarantee: 90%"</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 border-t border-slate-900">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Engineered for Pinpoint Document Reasoning</h2>
          <p className="text-slate-400 text-base">ApexRAG abstracts away the complexities of structural ingestion, multi-agent coordination, and uncertainty mapping, delivering the exact context required.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/20 hover:bg-slate-900/60 transition-all group">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Binary className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">Universal AST Parsers</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">Converts PDFs, Markdown, and raw Python code into typed hierarchical syntax nodes, retaining document outlines and tables deterministic relationships.</p>
          </div>
          {/* Feature 2 */}
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-violet-500/20 hover:bg-slate-900/60 transition-all group">
            <div className="h-10 w-10 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">Multi-Agent Orchestrator</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">Planner breaks queries down, Navigator walk AST layers, and Critic checks constraints to verify correct answers before generation.</p>
          </div>
          {/* Feature 3 */}
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-teal-500/20 hover:bg-slate-900/60 transition-all group">
            <div className="h-10 w-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <GitBranch className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">Causal Knowledge Graphs</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">Automatically builds structural and causal edges (Overrides, Contradicts, Supports) to walk relational connections dynamically during runtime.</p>
          </div>
          {/* Feature 4 */}
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/20 hover:bg-slate-900/60 transition-all group">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <History className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">Temporal Version Control</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">Supports time-travel queries allowing outline reconstructions "as-of" any point in history, complete with change detections and audit log trace.</p>
          </div>
          {/* Feature 5 */}
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-violet-500/20 hover:bg-slate-900/60 transition-all group">
            <div className="h-10 w-10 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">Enterprise Multi-Tenancy</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">Enforces tenant segregation and granular RBAC context directly down to AST nodes, masking or validating data at ingestion & query phases.</p>
          </div>
          {/* Feature 6 */}
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-teal-500/20 hover:bg-slate-900/60 transition-all group">
            <div className="h-10 w-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">Native OpenTelemetry</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">Named agent spans and traces automatically propagate to Grafana, Datadog, or Jaeger for total observability of system agent loops.</p>
          </div>
        </div>
      </section>

      {/* Interactive Agent Loop Simulator (Haystack style) */}
      <section id="visualizer" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 border-t border-slate-900">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Watch the Agents Reasoning</h2>
          <p className="text-slate-400 text-base">Traditional search matches keywords/vectors blindly. Here is what happens when you query ApexRAG.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Visual Map */}
          <div className="lg:col-span-7 flex flex-col justify-between p-8 rounded-2xl bg-slate-900/30 border border-slate-800/80">
            <div className="space-y-4">
              {agentSteps.map((st, idx) => (
                <div 
                  key={idx}
                  onClick={() => setActiveStep(idx)} 
                  className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${activeStep === idx ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800/60 hover:bg-slate-900/20'}`}
                >
                  <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${activeStep === idx ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {idx}
                  </div>
                  <div>
                    <h4 className={`text-base transition-colors ${activeStep === idx ? 'text-indigo-400 font-semibold' : 'text-slate-300 font-medium'}`}>
                      {st.title}
                    </h4>
                    <p className="text-sm text-slate-400 mt-1">{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-6 border-t border-slate-800/60 mt-6">
              <button 
                onClick={() => setActiveStep(prev => Math.max(0, prev - 1))} 
                className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 font-medium text-sm transition-colors disabled:opacity-50 disabled:pointer-events-none" 
                disabled={activeStep === 0}
              >
                Prev
              </button>
              <button 
                onClick={() => setActiveStep(prev => Math.min(5, prev + 1))} 
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold text-sm transition-colors text-white disabled:opacity-50 disabled:pointer-events-none" 
                disabled={activeStep === 5}
              >
                Next Step
              </button>
            </div>
          </div>

          {/* Terminal Logs */}
          <div className="lg:col-span-5 flex flex-col rounded-2xl bg-slate-950 border border-slate-855 overflow-hidden font-mono text-xs">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                <span className="text-slate-400 font-bold">REASONING TRACE LOGS</span>
              </div>
              <span className="text-teal-400 animate-pulse text-[10px] font-bold">● ACTIVE</span>
            </div>
            <div className="flex-1 p-6 space-y-3 overflow-y-auto max-h-[420px] code-scrollbar bg-slate-950/90">
              {visualizerLogs.slice(0, activeStep * 2 + 2).map((log, i) => (
                <div key={i} className="leading-relaxed">
                  <span className="text-slate-600 select-none mr-2">apex_rag:~$</span>
                  <span className={log.includes('[PLANNING]') ? 'text-indigo-400' : log.includes('[VERIFY]') ? 'text-teal-400' : log.includes('[AUDIT]') ? 'text-violet-400' : 'text-slate-300'}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ingestion AST Explorer (NumPy style) */}
      <section id="explorer" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 border-t border-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl font-extrabold text-white">Hierarchical AST Document Indexing</h2>
            <p className="text-slate-400 leading-relaxed text-sm">
              Traditional chunking chops text indiscriminately. ApexRAG extracts the actual document structure, nesting nodes (Outline, Sections, Tables) logically. Let's see how our parser indexes outlines.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">Preserves tables and lists intact instead of splitting rows across chunks.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300 font-sans">Creates parent-child outlines so agents can skip irrelevant sections.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300 font-sans">Constructs relational edges mapping function blocks or references.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/20 border border-slate-800/80 p-6 rounded-2xl">
            {/* Tree Selector */}
            <div className="space-y-2 font-mono text-xs">
              <span className="text-slate-500 font-bold block mb-4">AST FILE TREE INDEX</span>
              <div 
                onClick={() => setActiveNode('ROOT')} 
                className={`flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-slate-900/60 ${activeNode === 'ROOT' ? 'text-indigo-400 font-bold bg-slate-900/40' : 'text-slate-300 hover:text-white'}`}
              >
                <Folder className="h-4 w-4" /> <span>Annual_Report.pdf</span>
              </div>
              <div className="pl-4 border-l border-slate-800 space-y-2">
                <div 
                  onClick={() => setActiveNode('SEC1')} 
                  className={`flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-slate-900/60 ${activeNode === 'SEC1' ? 'text-indigo-400 font-bold bg-slate-900/40' : 'text-slate-300 hover:text-white'}`}
                >
                  <FileText className="h-4 w-4" /> <span>Section 1 (Summary)</span>
                </div>
                <div 
                  onClick={() => setActiveNode('SEC2')} 
                  className={`flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-slate-900/60 ${activeNode === 'SEC2' ? 'text-indigo-400 font-bold bg-slate-900/40' : 'text-slate-300 hover:text-white'}`}
                >
                  <Folder className="h-4 w-4" /> <span>Section 2 (Financials)</span>
                </div>
                <div className="pl-4 border-l border-slate-800 space-y-2">
                  <div 
                    onClick={() => setActiveNode('TAB2.1')} 
                    className={`flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-slate-900/60 ${activeNode === 'TAB2.1' ? 'text-indigo-400 font-bold bg-slate-900/40' : 'text-slate-300 hover:text-white'}`}
                  >
                    <Table className="h-4 w-4" /> <span>Table 2.1 (Sheet)</span>
                  </div>
                  <div 
                    onClick={() => setActiveNode('PAR2.2')} 
                    className={`flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-slate-900/60 ${activeNode === 'PAR2.2' ? 'text-indigo-400 font-bold bg-slate-900/40' : 'text-slate-300 hover:text-white'}`}
                  >
                    <AlignLeft className="h-4 w-4" /> <span>Paragraph 2.2 (Footnote)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Semantic Map Card */}
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-semibold">
                  {treeNodes[activeNode].type}
                </span>
                <h4 className="text-sm font-bold text-white mt-1 mb-4">
                  {treeNodes[activeNode].title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {treeNodes[activeNode].summary}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Node ID: ast_cf29...</span>
                <span className="text-indigo-400">Indexed: Yes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Code Playground Section */}
      <section id="playground" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 border-t border-slate-900">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Built for Developers</h2>
          <p className="text-slate-400 text-base">Simple pythonic hooks to initialize, ingest, query, stream, and configure security boundaries.</p>
        </div>

        <div className="glow-border bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col md:flex-row">
          {/* Vertical Tab List */}
          <div className="md:w-64 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/40 font-medium text-sm flex flex-col p-4 space-y-2">
            <button 
              onClick={() => setCodeTab('quick')} 
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${codeTab === 'quick' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'}`}
            >
              <Play className="h-4 w-4" /> Quick Start
            </button>
            <button 
              onClick={() => setCodeTab('stream')} 
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${codeTab === 'stream' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'}`}
            >
              <Radio className="h-4 w-4" /> Token Streaming
            </button>
            <button 
              onClick={() => setCodeTab('temporal')} 
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${codeTab === 'temporal' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'}`}
            >
              <History className="h-4 w-4" /> Temporal Time-Travel
            </button>
            <button 
              onClick={() => setCodeTab('rbac')} 
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${codeTab === 'rbac' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'}`}
            >
              <ShieldAlert className="h-4 w-4" /> Enterprise RBAC
            </button>
            <button 
              onClick={() => setCodeTab('graph')} 
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${codeTab === 'graph' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'}`}
            >
              <Network className="h-4 w-4" /> Causal Graph
            </button>
          </div>

          {/* Code Panel */}
          <div className="flex-1 flex flex-col min-w-0 bg-slate-950/80">
            <div className="px-5 py-3 border-b border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500">Python 3.10+ SDK</span>
              <button 
                onClick={copyCodePlayground} 
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-850 transition-colors"
              >
                {codeCopied ? <Check className="h-3.5 w-3.5 text-teal-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{codeCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-6 overflow-x-auto code-scrollbar font-mono text-sm leading-relaxed text-slate-300">
              <pre className="whitespace-pre">{codeSnippets[codeTab]}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Comparisons (LangChain style) */}
      <section id="comparisons" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 border-t border-slate-900">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">How it Compares</h2>
          <p className="text-slate-400 text-base">Why vector databases fall short for structured data, and how AST indexing fixes it.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="p-8 rounded-2xl border border-red-500/10 bg-red-950/5 relative overflow-hidden">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Traditional Vector RAG</span>
            <h3 className="text-2xl font-bold text-slate-200 mt-4 mb-3">Naïve Embedding Chunking</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">Split documents blindly into 512-token overlap blocks. Relies entirely on semantic math distance matching.</p>
            <ul className="space-y-3.5 text-sm text-slate-400 font-sans">
              <li className="flex items-start gap-3"><XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" /><span>Chops tables across margins, corrupting rows.</span></li>
              <li className="flex items-start gap-3"><XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" /><span>Loses structural heading relations completely.</span></li>
              <li className="flex items-start gap-3"><XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" /><span>Hallucination hazard on queries needing aggregate calculations.</span></li>
            </ul>
          </div>

          <div className="p-8 rounded-2xl border border-teal-500/10 bg-teal-950/5 relative overflow-hidden glow-border">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">ApexRAG Engine</span>
            <h3 className="text-2xl font-bold text-slate-200 mt-4 mb-3">Universal Outlined AST Tree</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">Parses outline indexes explicitly into node models. Relies on structured tree traversal and leaf confirmations.</p>
            <ul className="space-y-3.5 text-sm text-slate-400 font-sans">
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" /><span>Preserves tables, outlines, and structures intact.</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" /><span>Guided agent walking reads outlines logically before reading contents.</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" /><span>Separate leaf verifications enforce strict answers.</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Installer Matrix (vLLM style) */}
      <section id="installer" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 border-t border-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl font-extrabold text-white">Dynamic Installation Configuration</h2>
            <p className="text-slate-400 leading-relaxed text-sm">
              Customize package builds to include cloud engines (Anthropic, Groq, Gemini), local Ollama wrappers, telemetry databases, and web admin dashboards.
            </p>
            <div className="text-xs text-slate-500 space-y-2">
              <p>💡 Compatible with Python 3.10, 3.11, and 3.12.</p>
              <p>🔧 Uses pip, poetry, or pipenv. Virtual environments recommended.</p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-900/30 border border-slate-800/80 p-8 rounded-2xl space-y-6">
            {/* Choices Matrix */}
            <div className="space-y-4 text-xs font-semibold">
              {/* Release */}
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Release Build</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setRelease('stable')} 
                    className={`px-3.5 py-1.5 rounded transition-all ${release === 'stable' ? 'bg-indigo-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}
                  >
                    Stable v1.0.3
                  </button>
                  <button 
                    onClick={() => setRelease('nightly')} 
                    className={`px-3.5 py-1.5 rounded transition-all ${release === 'nightly' ? 'bg-indigo-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}
                  >
                    Nightly Build
                  </button>
                </div>
              </div>

              {/* Provider */}
              <div className="flex items-center justify-between">
                <span className="text-slate-400">LLM Provider SDKs</span>
                <div className="flex flex-wrap gap-2 justify-end">
                  {['openai', 'anthropic', 'groq', 'ollama', 'all'].map(p => (
                    <button 
                      key={p}
                      onClick={() => setProvider(p)} 
                      className={`px-3 py-1 rounded transition-all capitalize ${provider === p ? 'bg-indigo-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      {p === 'openai' ? 'OpenAI (Built-in)' : p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Telemetry */}
              <div className="flex items-center justify-between">
                <span className="text-slate-400">OpenTelemetry + Web API dashboard</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setTelemetry('no')} 
                    className={`px-3.5 py-1.5 rounded transition-all ${telemetry === 'no' ? 'bg-indigo-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}
                  >
                    Exclude
                  </button>
                  <button 
                    onClick={() => setTelemetry('yes')} 
                    className={`px-3.5 py-1.5 rounded transition-all ${telemetry === 'yes' ? 'bg-indigo-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}
                  >
                    Include
                  </button>
                </div>
              </div>
            </div>

            {/* Command Display */}
            <div className="pt-6 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Install Command:</span>
                <button onClick={copyInstallCommand} className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                  <Copy className="h-3.5 w-3.5" /> Copy Command
                </button>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg font-mono text-sm border border-slate-800 text-indigo-200">
                {getInstallCommand()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLI Reference Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 border-t border-slate-900">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Full Command-Line Interface</h2>
          <p className="text-slate-400 text-base">ApexRAG ships with a complete diagnostic and serve CLI out-of-the-box.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
          <div className="p-5 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
            <span className="text-indigo-400 font-bold">$ python -m apex_rag serve</span>
            <p className="text-slate-400 font-sans text-xs">Starts the FastAPI REST server complete with auth tokens, CORS mappings, and rate limits.</p>
          </div>
          <div className="p-5 bg-slate-950 border border-slate-855 rounded-xl space-y-2">
            <span className="text-indigo-400 font-bold">$ python -m apex_rag ingest &lt;file&gt;</span>
            <p className="text-slate-400 font-sans text-xs">Ingests PDF, DOCX, or markdown outlines locally into SQLite/Postgres AST storage schemas.</p>
          </div>
          <div className="p-5 bg-slate-950 border border-slate-855 rounded-xl space-y-2">
            <span className="text-indigo-400 font-bold">$ python -m apex_rag query &lt;doc_id&gt; &lt;q&gt;</span>
            <p className="text-slate-400 font-sans text-xs">Runs the multi-agent outline logic search against an ingested document outline ID.</p>
          </div>
          <div className="p-5 bg-slate-950 border border-slate-855 rounded-xl space-y-2">
            <span className="text-indigo-400 font-bold">$ python -m apex_rag repl</span>
            <p className="text-slate-400 font-sans text-xs">Launches the interactive shell console to trace and check agent traversals visually.</p>
          </div>
          <div className="p-5 bg-slate-950 border border-slate-855 rounded-xl space-y-2">
            <span className="text-indigo-400 font-bold">$ python -m apex_rag doctor</span>
            <p className="text-slate-400 font-sans text-xs">Runs systems diagnostics validating database linkages, provider access, and environment bindings.</p>
          </div>
          <div className="p-5 bg-slate-950 border border-slate-855 rounded-xl space-y-2">
            <span className="text-indigo-400 font-bold">$ python -m apex_rag info</span>
            <p className="text-slate-400 font-sans text-xs">Shows package configuration attributes, active caches, database sizes, and API builds.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-12 relative z-10 text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center">
              <Network className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-sm text-slate-400">ApexRAG Engine</span>
          </div>
          <div className="flex gap-6">
            <a href="https://github.com/abinivas-17/apex-rag" className="hover:text-slate-350 transition-colors">GitHub Repository</a>
            <a href="https://pypi.org/project/apex-rag/" className="hover:text-slate-350 transition-colors">PyPI Release</a>
            <a href="https://docs.vllm.ai" className="hover:text-slate-350 transition-colors">Docs Portal</a>
          </div>
          <div>
            <span>&copy; 2026 G S Abinivas. MIT Licensed.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
