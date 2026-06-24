import React, { useState, useMemo, useEffect, useRef } from 'react';
import { documentationDb } from './data/docsData';
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
  FolderOpen,
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
  Search,
  BookOpen,
  Home,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
  Code,
  ArrowLeft,
  ArrowRightLeft
} from 'lucide-react';

// Custom inline SVG for GitHub brand icon
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
  // ── Navigation State ──────────────────────────────────────────────────────
  const [viewMode, setViewMode] = useState('landing'); // 'landing' | 'docs'
  const [selectedDocId, setSelectedDocId] = useState('quickstart');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  // Keyboard shortcut for search modal (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus search input when modal opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 50);
    }
  }, [searchOpen]);

  // ── vLLM Style Installer Builder State ───────────────────────────────────
  const [release, setRelease] = useState('stable'); // 'stable' | 'nightly'
  const [source, setSource] = useState('pip'); // 'pip' | 'conda' | 'source'
  const [environment, setEnvironment] = useState('cuda121'); // 'cpu' | 'cuda121' | 'cuda118' | 'rocm'
  const [provider, setProvider] = useState('openai'); // 'openai' | 'anthropic' | 'groq' | 'ollama' | 'none'
  const [extras, setExtras] = useState({
    web: false,
    postgres: false,
    vectors: true,
    telemetry: false,
  });
  const [installCopied, setInstallCopied] = useState(false);

  const handleExtraToggle = (key) => {
    setExtras(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getInstallerCommand = () => {
    if (source === 'source') {
      return `git clone https://github.com/abinivas-17/apex-rag.git\ncd apex-rag\nmake install-all`;
    }
    
    let pipExtras = [];
    if (provider !== 'openai' && provider !== 'none') {
      pipExtras.push(provider);
    }
    if (extras.postgres) pipExtras.push('postgres');
    if (extras.vectors) pipExtras.push('vectors');
    if (extras.telemetry) pipExtras.push('telemetry');
    if (extras.web) pipExtras.push('web');

    let suffix = "";
    if (pipExtras.length > 0) {
      suffix = `[${pipExtras.join(',')}]`;
    }

    if (source === 'conda') {
      return `conda create -n apex env python=3.10 -y\nconda activate apex\npip install "apex-rag${suffix}"`;
    }

    if (release === 'nightly') {
      return `pip install --pre "apex-rag${suffix}"`;
    }
    return `pip install "apex-rag${suffix}"`;
  };

  const copyInstallerCommand = () => {
    navigator.clipboard.writeText(getInstallerCommand());
    setInstallCopied(true);
    setTimeout(() => setInstallCopied(false), 2000);
  };

  // Dependecy specifications map for vLLM matrix
  const activeDependencies = useMemo(() => {
    const deps = ['sqlalchemy', 'aiosqlite', 'markitdown', 'rich'];
    if (provider === 'openai') deps.push('openai');
    if (provider === 'anthropic') deps.push('anthropic');
    if (provider === 'groq') deps.push('groq');
    if (extras.web) deps.push('fastapi', 'uvicorn', 'jinja2');
    if (extras.postgres) deps.push('asyncpg', 'psycopg2-binary');
    if (extras.vectors) deps.push('sentence-transformers', 'numpy');
    if (extras.telemetry) deps.push('opentelemetry-api', 'opentelemetry-sdk', 'opentelemetry-exporter-otlp');
    return deps;
  }, [provider, extras]);

  // ── Haystack Style Agent Flow Visualizer State ───────────────────────────
  const [activeStep, setActiveStep] = useState(0);
  const consoleRef = useRef(null);

  const agentSteps = [
    { 
      id: 0, 
      title: 'Query Input', 
      role: 'User Query Front',
      desc: 'Structured query facade receives complex raw input.',
      inputs: 'User Question (e.g. Compare Q2 and Q3 revenue margins)',
      outputs: 'Parsed payload, active tenant credentials',
      params: 'N/A',
      logs: [
        'Initialize query sequence: Compare Q2 and Q3 revenue margins.',
        'Loading authorization token: TenantDivA active.',
        'Access key valid. Dispatched to orchestrator.'
      ]
    },
    { 
      id: 1, 
      title: 'Query Planner', 
      role: 'QueryPlannerAgent',
      desc: 'Deconstructs the question into sequential outline sub-tasks.',
      inputs: 'Raw text query',
      outputs: 'JSON sub-plan list: ["Fetch Q2 revenue", "Fetch Q3 revenue"]',
      params: 'Model: gpt-4o, Temperature: 0.1',
      logs: [
        '[PLANNING] Deconstructing query into logical sub-tasks.',
        '[PLANNING] Task 1 resolved: Reconstruct Section 2.1 Q2 financials.',
        '[PLANNING] Task 2 resolved: Reconstruct Section 2.1 Q3 financials.',
        '[PLANNING] Query plan generated successfully with 2 dependency branches.'
      ]
    },
    { 
      id: 2, 
      title: 'Outline Filter', 
      role: 'KeywordDeterministicRetriever',
      desc: 'Retrieves candidate nodes using BM25, outline matches and headings indices.',
      inputs: 'Query sub-tasks',
      outputs: 'Top 5 candidate AST outline nodes',
      params: 'BM25 Weight: 0.7, Structural Weight: 0.3',
      logs: [
        '[FILTER] Querying local FTS5 database indices.',
        '[FILTER] Structural match score calculated across outlines headers.',
        '[FILTER] Top Candidate: Node SEC2 (Section 2: Financial Metrics).',
        '[FILTER] Underneath candidates matching outline: TAB2.1, PAR2.2.',
        '[FILTER] Candidate outline pool initialized. Prevented full AST load.'
      ]
    },
    { 
      id: 3, 
      title: 'AST Navigation', 
      role: 'ASTNavigationAgent',
      desc: 'Navigates candidate branches comparing outline summaries.',
      inputs: 'Candidate outlines + plan tasks',
      outputs: 'Matched target leaf nodes containing text details',
      params: 'Model: llama3.1, Max Steps: 10',
      logs: [
        '[NAVIGATOR] Tree walk started at node: ROOT.',
        '[NAVIGATOR] Evaluating children of SEC2.',
        '[NAVIGATOR] Reading intent signpost summaries for SEC2.1.',
        '[NAVIGATOR] Navigation step: Selected node TAB2.1 (Performance Table).',
        '[NAVIGATOR] Target leaf content fetched successfully.'
      ]
    },
    { 
      id: 4, 
      title: 'Leaf Verification', 
      role: 'StrictLeafVerifier',
      desc: 'Ensures the fetched nodes answer the query, blocking hallucinations.',
      inputs: 'Fetched nodes + sub-queries',
      outputs: 'Binary verification status (TRUE/FALSE)',
      params: 'Model: phi3, Threshold: 0.85',
      logs: [
        '[VERIFIER] Running verification on Node TAB2.1.',
        '[VERIFIER] Evaluating if TAB2.1 answers Q2 metrics... TRUE.',
        '[VERIFIER] Evaluating if TAB2.1 answers Q3 metrics... TRUE.',
        '[VERIFIER] Checked paragraph growth footnotes. Re-verify node details... TRUE.',
        '[VERIFIER] Zero hallucinations detected. Leaf data approved.'
      ]
    },
    { 
      id: 5, 
      title: 'Critic Audit', 
      role: 'EvaluationCriticAgent',
      desc: 'Evaluates aggregate response boundaries and conformal coverage.',
      inputs: 'Aggregated context + initial plan',
      outputs: 'Aggregated answer coverage matrix',
      params: 'Target Coverage: 90%, Confidence: 94.2%',
      logs: [
        '[CRITIC] Commencing evaluation review.',
        '[CRITIC] Checking if both sub-tasks have verified answers.',
        '[CRITIC] Conformal guarantee range validated: Score 94.2% (Target >= 90.0%).',
        '[CRITIC] Answers checked. Conformal verification passed.'
      ]
    },
    { 
      id: 6, 
      title: 'Output Answer', 
      role: 'AnswerSynthesizer',
      desc: 'Generates final response with citations linked directly to AST paths.',
      inputs: 'Verified context + audit logs',
      outputs: 'Final Answer + Source Citations + Path Logs',
      params: 'Model: gpt-4o, Citation schema: LTree paths',
      logs: [
        '[SYNTHESIZER] Formatting output block.',
        '[SYNTHESIZER] Generating response with semantic footnotes.',
        'DONE: Reconstructed Q2 and Q3 revenue margins with direct AST citations.',
        'Answer successfully emitted.'
      ]
    }
  ];

  // Compile active logs dynamically up to selected agent step
  const accumulatedLogs = useMemo(() => {
    let logs = [];
    for (let i = 0; i <= activeStep; i++) {
      logs = [...logs, ...agentSteps[i].logs];
    }
    return logs;
  }, [activeStep]);

  // Scroll terminal logs to bottom on changes
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [accumulatedLogs]);

  // ── NumPy Style AST Folder Explorer State ──────────────────────────────
  const [activeNodeId, setActiveNodeId] = useState('ROOT');
  const [expandedNodes, setExpandedNodes] = useState({
    'ROOT': true,
    'SEC1': false,
    'SEC2': true
  });
  const [explorerTab, setExplorerTab] = useState('metadata'); // 'metadata' | 'source' | 'graph'

  const toggleNodeExpand = (id) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const treeData = {
    'ROOT': {
      id: 'ROOT',
      title: 'Annual_Report.pdf',
      type: 'document',
      summary: 'Root index of the ingested document. Tracks structural outline headers, security parameters, and page lengths.',
      metadata: {
        'Total Pages': '24 pages',
        'Ingestion Date': '2026-06-24',
        'Parser Backend': 'markitdown',
        'FTS5 Status': 'Indexed',
        'Security Scope': 'TenantDivA'
      },
      content: `# Annual Report 2024\n\nThis is the document root. It contains the Executive Summary (Section 1) and Financial Metrics (Section 2). Select nested folders to browse node components.`,
      children: ['SEC1', 'SEC2']
    },
    'SEC1': {
      id: 'SEC1',
      title: 'Section 1: Executive Summary',
      type: 'section',
      summary: 'Outlines Q2-Q3 revenue, business milestones, and corporate pipeline updates.',
      metadata: {
        'Header Level': 'H1',
        'Outline Depth': 'Level 1',
        'Signpost Intent': 'Business Summary',
        'Page Range': 'Page 1 - 4'
      },
      content: `## Section 1: Executive Summary\n\nOur mission is to establish agentic retrieval standards globally. During 2024, our client portfolio expanded 148%, driving structural RAG research.`,
      children: ['PAR1.1', 'PAR1.2']
    },
    'PAR1.1': {
      id: 'PAR1.1',
      title: 'Paragraph 1.1: Core Mission',
      type: 'paragraph',
      summary: 'A description of corporate mission statement and goals.',
      metadata: {
        'Leaf Type': 'Paragraph',
        'Line Number': 'Line 12 - 28',
        'Word Count': '84 words',
        'Page Number': 'Page 2'
      },
      content: `ApexRAG was engineered from the ground up to solve context loss in LLMs. By representing layouts as Hierarchical AST trees, we enable agents to explore documents as structured objects rather than raw vectors, improving retrieval accuracy by 94.2%.`,
      children: []
    },
    'PAR1.2': {
      id: 'PAR1.2',
      title: 'Paragraph 1.2: Market Position',
      type: 'paragraph',
      summary: 'Outline of competitors and vector RAG challenges.',
      metadata: {
        'Leaf Type': 'Paragraph',
        'Line Number': 'Line 30 - 45',
        'Word Count': '52 words',
        'Page Number': 'Page 3'
      },
      content: `Traditional Vector databases suffer from layout ignorance, chopping tables and headings blindly. This paragraph outlines competitors and explains the necessity of structured retrieval.`,
      children: []
    },
    'SEC2': {
      id: 'SEC2',
      title: 'Section 2: Financial Metrics',
      type: 'section',
      summary: 'Financial balances sheet showing operational budgets, assets, expenditures, and revenue margins.',
      metadata: {
        'Header Level': 'H1',
        'Outline Depth': 'Level 1',
        'Signpost Intent': 'Financial Details',
        'Page Range': 'Page 5 - 12'
      },
      content: `## Section 2: Financial Metrics\n\nFinancial operations completed Q3 with robust balances sheets. Please check Table 2.1 for net profits and Paragraph 2.2 for growth footnote summaries.`,
      children: ['TAB2.1', 'PAR2.2']
    },
    'TAB2.1': {
      id: 'TAB2.1',
      title: 'Table 2.1: Performance Balance Sheet',
      type: 'table',
      summary: 'Structured metrics table mapping expenditures, margins, and operating revenues.',
      metadata: {
        'Leaf Type': 'Table',
        'Rows': '4',
        'Columns': '3',
        'Page Number': 'Page 6',
        'Data Schema': 'Quarterly Margins'
      },
      content: `| Metric | Q2 2024 | Q3 2024 |\n|---|---|---|\n| Revenue | $128.4M | $165.0M |\n| R&D Exp. | $74.2M | $89.0M |\n| Net Profit | $18.6M | $28.4M |`,
      children: []
    },
    'PAR2.2': {
      id: 'PAR2.2',
      title: 'Paragraph 2.2: Explanatory Growth notes',
      type: 'paragraph',
      summary: 'Footnote explanation detailing calculation variables of Q3 margins.',
      metadata: {
        'Leaf Type': 'Paragraph',
        'Line Number': 'Line 144 - 156',
        'Word Count': '46 words',
        'Page Number': 'Page 8'
      },
      content: `Footnote: Q3 growth of 28.5% year-over-year is calculated based on net operating profit ($28.4M) vs previous Q2 revenue ($18.6M) and matches audited guidelines. Refer to Table 2.1 for base assets.`,
      children: []
    }
  };

  const activeNode = treeData[activeNodeId];

  // Render a nice visual representation of the table content if it's a table type
  const renderTableHTML = (mdTable) => {
    const lines = mdTable.split('\n');
    const headers = lines[0].split('|').map(c => c.trim()).filter(Boolean);
    const rows = lines.slice(2).map(line => line.split('|').map(c => c.trim()).filter(Boolean)).filter(r => r.length > 0);

    return (
      <div className="overflow-x-auto border border-slate-800 rounded-lg bg-slate-950/60 my-2">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 border-b border-slate-800">
              {headers.map((h, i) => <th key={i} className="p-3 font-mono font-bold text-slate-300">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} className="border-b border-slate-800/50 hover:bg-slate-900/20">
                {r.map((c, ci) => <td key={ci} className="p-3 font-mono text-slate-400">{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // ── Code Playground State ────────────────────────────────────────────────
  const [codeTab, setCodeTab] = useState('quick');
  const [codeCopied, setCodeCopied] = useState(false);

  const codeSnippets = {
    'quick': `import asyncio
from apex_rag import ApexIndex

async def main():
    # 1. Initialize ApexIndex with OpenAI LLM
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
print(result["result"])      # The resolved text answer
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

  // ── Documentation Database Search & Filtering (LangChain style) ─────────
  const docKeys = Object.keys(documentationDb);
  
  // Full text filter logic querying title, keywords, summaries and contents
  const filteredDocKeys = useMemo(() => {
    if (!searchQuery) return docKeys;
    const query = searchQuery.toLowerCase();
    return docKeys.filter(key => {
      const doc = documentationDb[key];
      return (
        doc.title.toLowerCase().includes(query) ||
        doc.category.toLowerCase().includes(query) ||
        doc.keywords.toLowerCase().includes(query) ||
        doc.summary.toLowerCase().includes(query) ||
        doc.html.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  const activeDoc = documentationDb[selectedDocId] || documentationDb.quickstart;

  // Group keys by category for left sidebar menu
  const docsByCategory = useMemo(() => {
    const groups = {};
    filteredDocKeys.forEach(key => {
      const doc = documentationDb[key];
      if (!groups[doc.category]) {
        groups[doc.category] = [];
      }
      groups[doc.category].push(doc);
    });
    return groups;
  }, [filteredDocKeys]);

  // Sidebar accordions state - initially open all
  const [accordionState, setAccordionState] = useState({
    'Getting Started': true,
    'Developer Guides': true,
    'Enterprise Guides': true,
    'Project Info': true
  });

  const toggleAccordion = (cat) => {
    setAccordionState(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Paging Navigation (Next/Prev) at bottom of documentation
  const pageListOrder = [
    'quickstart',
    'installation',
    'configuration',
    'ingestion',
    'querying',
    'hybrid-search',
    'batch-ingestion',
    'rest-api',
    'monitoring',
    'architecture',
    'docker',
    'production-checklist',
    'user-manual',
    'migration-guide',
    'contributing',
    'changelog',
    'troubleshooting',
    'security'
  ];

  const currentPageIndex = pageListOrder.indexOf(activeDoc.id);
  const prevPage = currentPageIndex > 0 ? documentationDb[pageListOrder[currentPageIndex - 1]] : null;
  const nextPage = currentPageIndex < pageListOrder.length - 1 ? documentationDb[pageListOrder[currentPageIndex + 1]] : null;

  // ── Scroll Spy / TOC Tracking ─────────────────────────────────────────────
  const [activeHeadingId, setActiveHeadingId] = useState('');
  const contentObserverRef = useRef(null);

  useEffect(() => {
    // We observe headers inside the article panel
    if (viewMode === 'docs' && activeDoc) {
      const headingElements = Array.from(document.querySelectorAll('.prose-content h2, .prose-content h3'));
      if (headingElements.length === 0) return;

      const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60% 0px',
        threshold: 0
      };

      const handleIntersection = (entries) => {
        // Find entries that are intersecting
        const visibleHeadings = entries.filter(e => e.isIntersecting);
        if (visibleHeadings.length > 0) {
          // Select the top-most intersecting header
          setActiveHeadingId(visibleHeadings[0].target.id);
        }
      };

      const observer = new IntersectionObserver(handleIntersection, observerOptions);
      headingElements.forEach(el => observer.observe(el));
      
      return () => {
        headingElements.forEach(el => observer.unobserve(el));
        observer.disconnect();
      };
    }
  }, [viewMode, selectedDocId, activeDoc]);

  // Attach dynamic listener for code block copy buttons inside dangerouslySetInnerHTML
  useEffect(() => {
    const handleArticleClick = (e) => {
      // Handle copy buttons inside code blocks
      const copyBtn = e.target.closest('.copy-doc-code');
      if (copyBtn) {
        const rawCode = copyBtn.getAttribute('data-code');
        if (rawCode) {
          navigator.clipboard.writeText(rawCode);
          const originalHTML = copyBtn.innerHTML;
          copyBtn.innerHTML = `<span class="text-teal-400 font-semibold">Copied!</span>`;
          setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
          }, 1500);
        }
        return;
      }

      // Handle internal markdown links
      const anchor = e.target.closest('a');
      if (anchor) {
        const docId = anchor.getAttribute('data-internal-doc');
        const hashAnchor = anchor.getAttribute('data-internal-anchor');
        if (docId) {
          e.preventDefault();
          setSelectedDocId(docId);
          if (hashAnchor) {
            setTimeout(() => {
              const targetElement = document.getElementById(hashAnchor);
              if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
              }
            }, 100);
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      }
    };

    document.addEventListener('click', handleArticleClick);
    return () => document.removeEventListener('click', handleArticleClick);
  }, []);

  return (
    <div className="bg-slate-950 text-slate-100 font-sans antialiased min-h-screen relative overflow-x-hidden dot-grid">
      
      {/* Top Glowing Blur Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] hero-glow pointer-events-none z-0"></div>

      {/* Header Navigation */}
      <header className="sticky top-0 z-45 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="#" onClick={() => { setViewMode('landing'); setMobileMenuOpen(false); }} className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Network className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">ApexRAG</span>
              <span className="text-[9px] block font-mono text-indigo-400 -mt-1 font-semibold">v1.0.3</span>
            </div>
          </a>

          {/* Search Button Link */}
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
            <button 
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-between w-full bg-slate-900/50 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-500 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-slate-400" />
                <span>Search documentation...</span>
              </div>
              <span className="bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded text-[10px] font-mono">Ctrl K</span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => setViewMode('landing')} 
              className={`text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${viewMode === 'landing' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
            >
              <Home className="h-4 w-4" /> Home
            </button>
            <button 
              onClick={() => { setViewMode('docs'); setSelectedDocId('quickstart'); }} 
              className={`text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${viewMode === 'docs' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
            >
              <BookOpen className="h-4 w-4" /> Docs
            </button>
            <a 
              target="_blank" 
              rel="noopener noreferrer" 
              href="https://github.com/abinivas-17/apex-rag" 
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-sm font-medium hover:bg-slate-850 hover:text-white transition-all hover:scale-105"
            >
              <GithubIcon className="h-4 w-4 text-slate-400" />
              <span>GitHub</span>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={() => setSearchOpen(true)} className="p-2 hover:bg-slate-900 rounded-lg text-slate-400">
              <Search className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="p-2 hover:bg-slate-900 rounded-lg text-slate-400"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-3 flex flex-col">
            <button 
              onClick={() => { setViewMode('landing'); setMobileMenuOpen(false); }} 
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-900 w-full text-left"
            >
              <Home className="h-4 w-4 text-indigo-400" /> Home Page
            </button>
            <button 
              onClick={() => { setViewMode('docs'); setSelectedDocId('quickstart'); setMobileMenuOpen(false); }} 
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-900 w-full text-left"
            >
              <BookOpen className="h-4 w-4 text-indigo-400" /> Documentation Portal
            </button>
            <a 
              target="_blank" 
              rel="noopener noreferrer" 
              href="https://github.com/abinivas-17/apex-rag" 
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm font-medium hover:bg-slate-850 text-white"
            >
              <GithubIcon className="h-4 w-4" />
              <span>GitHub Repository</span>
            </a>
          </div>
        )}
      </header>

      {/* ── LANDING PAGE VIEW ───────────────────────────────────────────────── */}
      {viewMode === 'landing' && (
        <>
          {/* Hero Section */}
          <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-semibold text-indigo-400 shadow-md">
                  <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-ping"></span>
                  <span>Multi-Agent Structural RAG Engine</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-white">
                  Stop Guessing with Vectors.<br/>
                  <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-teal-400 bg-clip-text text-transparent">Navigate with Agents.</span>
                </h1>
                <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
                  ApexRAG structures documents into a strict <strong className="text-slate-200">Universal AST tree</strong> outline, utilizing coordinate agents (Planner, Navigator, Critic) to query information logically and ensure pinpoint accuracy with conformal prediction confidence layers.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                  <button 
                    onClick={() => { setViewMode('docs'); setSelectedDocId('quickstart'); }} 
                    className="px-6 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 cursor-pointer active:scale-95 text-sm"
                  >
                    <span>Explore Documentation</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-lg overflow-hidden pr-2">
                    <span className="px-4 py-3.5 font-mono text-xs text-indigo-400 bg-slate-950/40 border-r border-slate-800 select-all">$ pip install apex-rag</span>
                    <button onClick={copyInstallerCommand} className="p-2 text-slate-400 hover:text-white transition-colors" title="Copy command">
                      {installCopied ? <Check className="h-4 w-4 text-teal-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* IDE Code Frame Panel */}
              <div className="lg:col-span-5 relative">
                <div className="glow-border rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-2xl p-6 relative">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                      <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                      <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                    </div>
                    <span className="font-mono text-xs text-slate-500">quick_start.py</span>
                  </div>
                  <div className="pt-4 font-mono text-xs leading-relaxed text-indigo-200 overflow-x-auto code-scrollbar">
                    <span className="text-purple-400">from</span> {"apex_rag "} <span className="text-purple-400">import</span> {"ApexIndex"}<br/><br/>
                    <span className="text-slate-500"># 1. Initialize with OpenAI/Ollama</span><br/>
                    <span className="text-teal-400">index</span> = <span className="text-purple-400">await</span> {"ApexIndex."}<span className="text-blue-400">create</span>(provider=<span className="text-amber-400">"openai"</span>)<br/><br/>
                    <span className="text-slate-500"># 2. Ingest document structurally</span><br/>
                    <span className="text-teal-400">doc_id</span> = <span className="text-purple-400">await</span> {"index."}<span className="text-blue-400">ingest</span>(<span className="text-amber-400">"annual_report.pdf"</span>)<br/><br/>
                    <span className="text-slate-500">{"# 3. Query (Planner -> Navigator -> Critic)"}</span><br/>
                    <span className="text-teal-400">answer</span> = <span className="text-purple-400">await</span> {"index."}<span className="text-blue-400">query</span>(<span className="text-amber-400">"What is Q3 growth?"</span>, doc_id)<br/><br/>
                    <span className="text-blue-400">print</span>(answer.<span className="text-teal-400">answer_text</span>)<br/>
                    <span className="text-blue-400">print</span>(answer.<span className="text-teal-400">coverage_guarantee</span>)<br/>
                    <span className="text-slate-500"># &gt; "Q3 growth was 28.5% [Node: Table 2.1]"</span><br/>
                    <span className="text-slate-500"># &gt; "Confidence Guarantee: 94.2%"</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 border-t border-slate-900/60">
            <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Engineered for Pinpoint Document Reasoning</h2>
              <p className="text-slate-400 text-sm">ApexRAG bypasses raw chunk index searches, compiling files to outlined models and orchestrating specialized agents.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/25 hover:bg-slate-900/60 transition-all group">
                <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Binary className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-200 mb-2">Universal AST Parsers</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">Converts PDF, DOCX, Markdown and Python code into typed AST syntax branches, retaining hierarchical headers and grid tables intact.</p>
              </div>
              <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-violet-500/25 hover:bg-slate-900/60 transition-all group">
                <div className="h-10 w-10 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-200 mb-2">Multi-Agent Loops</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">Planner deconstructs questions, Navigator walks branches using Signposts, and Verifier validates leaf nodes prior to synthesizer generation.</p>
              </div>
              <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-teal-500/25 hover:bg-slate-900/60 transition-all group">
                <div className="h-10 w-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <GitBranch className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-200 mb-2">Causal Knowledge Graphs</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">Links syntax components to create semantic maps representing relationships (`SUPERSEDES`, `REFERENCES_TABLE`) to guide retrieval paths.</p>
              </div>
              <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/25 hover:bg-slate-900/60 transition-all group">
                <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <History className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-200 mb-2">Temporal State Reconstruction</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">Queries outline structures dynamically as they existed in the past, performing diffs and tracking revision histories seamlessly.</p>
              </div>
              <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-violet-500/25 hover:bg-slate-900/60 transition-all group">
                <div className="h-10 w-10 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-200 mb-2">Enterprise Multi-Tenancy</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">Strict security wrappers scope index operations by Tenant Context, executing field-masking directly inside database levels.</p>
              </div>
              <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-teal-500/25 hover:bg-slate-900/60 transition-all group">
                <div className="h-10 w-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Activity className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-200 mb-2">Native Observability</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">Emits named spans matching OpenTelemetry guidelines, allowing easy visual debugging inside Grafana, Datadog or Jaeger.</p>
              </div>
            </div>
          </section>

          {/* Haystack Style SVG Agent Pipeline Visualizer */}
          <section id="visualizer" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 border-t border-slate-900/60">
            <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Interactive Multi-Agent Flow Visualizer</h2>
              <p className="text-slate-400 text-sm">Follow step-by-step how coordinates agents plan, filter, walk down AST outline trunks, and audit results.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Interactive SVG Diagram Node Container */}
              <div className="lg:col-span-8 flex flex-col p-6 sm:p-8 rounded-2xl bg-slate-900/20 border border-slate-800/80">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6 block font-mono">Orchestrator Pipeline Canvas</div>
                
                {/* SVG Visual Layout */}
                <div className="relative flex-1 flex flex-col justify-center min-h-[300px]">
                  {/* SVG background curves and glowing animated pulses */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: '300px' }}>
                    <defs>
                      <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#14b8a6" />
                      </linearGradient>
                    </defs>
                    
                    {/* SVG Connector Lines */}
                    {agentSteps.slice(0, -1).map((step, idx) => {
                      const startX = 6 + (idx * 14.5);
                      const nextX = 6 + ((idx + 1) * 14.5);
                      const isActive = activeStep > idx;
                      
                      return (
                        <g key={idx}>
                          {/* Base connector line */}
                          <line 
                            x1={`${startX}%`} 
                            y1="50%" 
                            x2={`${nextX}%`} 
                            y2="50%" 
                            stroke="#1e293b" 
                            strokeWidth="2" 
                          />
                          {/* Glowing active connector path */}
                          {isActive && (
                            <line 
                              x1={`${startX}%`} 
                              y1="50%" 
                              x2={`${nextX}%`} 
                              y2="50%" 
                              stroke="url(#glowGrad)" 
                              strokeWidth="3" 
                              className="path-pulse"
                            />
                          )}
                        </g>
                      );
                    })}
                  </svg>

                  {/* Horizontal node list layout */}
                  <div className="relative flex items-center justify-between z-10 px-4">
                    {agentSteps.map((step) => {
                      const isCompleted = activeStep > step.id;
                      const isActive = activeStep === step.id;
                      
                      return (
                        <button 
                          key={step.id}
                          onClick={() => setActiveStep(step.id)}
                          className="flex flex-col items-center group cursor-pointer focus:outline-none"
                          style={{ width: '12%' }}
                        >
                          <div className={`h-11 w-11 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                            isActive 
                              ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/20 scale-110' 
                              : isCompleted 
                              ? 'bg-teal-500/10 border-teal-500 text-teal-400' 
                              : 'bg-slate-900 border-slate-800 text-slate-500 group-hover:border-slate-700'
                          }`}>
                            {step.id === 0 && <Terminal className="h-5 w-5" />}
                            {step.id === 1 && <Cpu className="h-5 w-5" />}
                            {step.id === 2 && <Layers className="h-5 w-5" />}
                            {step.id === 3 && <GitBranch className="h-5 w-5" />}
                            {step.id === 4 && <ShieldCheck className="h-5 w-5" />}
                            {step.id === 5 && <ShieldAlert className="h-5 w-5" />}
                            {step.id === 6 && <CheckCircle className="h-5 w-5" />}
                          </div>
                          
                          {/* Label titles */}
                          <span className={`text-[10px] sm:text-[11px] font-semibold text-center mt-3 truncate w-full ${
                            isActive ? 'text-indigo-400 font-bold' : isCompleted ? 'text-teal-400' : 'text-slate-500'
                          }`}>
                            {step.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Node details panel */}
                <div className="mt-8 p-5 bg-slate-950/60 border border-slate-800/80 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-widest">{agentSteps[activeStep].role}</span>
                    <h3 className="text-sm font-bold text-slate-200 mt-1 mb-2">{agentSteps[activeStep].title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">{agentSteps[activeStep].desc}</p>
                  </div>
                  <div className="space-y-1.5 font-mono text-[10px] text-slate-500 border-t md:border-t-0 md:border-l border-slate-800/80 pt-3 md:pt-0 md:pl-4">
                    <div><span className="text-indigo-400">Inputs:</span> <span className="text-slate-350">{agentSteps[activeStep].inputs}</span></div>
                    <div><span className="text-indigo-400">Outputs:</span> <span className="text-slate-350">{agentSteps[activeStep].outputs}</span></div>
                    <div><span className="text-indigo-400">Parameters:</span> <span className="text-slate-350">{agentSteps[activeStep].params}</span></div>
                  </div>
                </div>

                {/* Navigation actions */}
                <div className="flex items-center justify-between border-t border-slate-800/60 mt-6 pt-4">
                  <button 
                    onClick={() => setActiveStep(prev => Math.max(0, prev - 1))} 
                    className="px-3.5 py-1.5 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 font-semibold text-xs transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer" 
                    disabled={activeStep === 0}
                  >
                    Prev Stage
                  </button>
                  <button 
                    onClick={() => setActiveStep(prev => Math.min(6, prev + 1))} 
                    className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs transition-colors text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-lg shadow-indigo-600/25" 
                    disabled={activeStep === 6}
                  >
                    Next Stage
                  </button>
                </div>
              </div>

              {/* Console Terminal Logs Panel */}
              <div className="lg:col-span-4 flex flex-col rounded-2xl bg-slate-950 border border-slate-850 overflow-hidden font-mono text-[11px] shadow-2xl">
                <div className="px-4 py-3 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                    <span className="text-slate-400 font-bold tracking-tight">REASONING TRACE CONSOLE</span>
                  </div>
                  <span className="text-teal-400 animate-pulse text-[9px] font-bold">● ACTIVE</span>
                </div>
                
                <div ref={consoleRef} className="flex-1 p-5 space-y-3 overflow-y-auto max-h-[380px] code-scrollbar bg-slate-950/80">
                  {accumulatedLogs.map((log, i) => (
                    <div key={i} className="leading-relaxed">
                      <span className="text-slate-600 select-none mr-2">apex_rag:~$</span>
                      <span className={
                        log.startsWith('[PLANNING]') ? 'text-indigo-400' :
                        log.startsWith('[FILTER]') ? 'text-sky-400' :
                        log.startsWith('[NAVIGATOR]') ? 'text-violet-400' :
                        log.startsWith('[VERIFIER]') ? 'text-teal-400' :
                        log.startsWith('[CRITIC]') ? 'text-amber-400' :
                        log.startsWith('DONE') ? 'text-green-400 font-bold' : 'text-slate-300'
                      }>
                        {log}
                      </span>
                    </div>
                  ))}
                  <div className="inline-block w-1.5 h-3 bg-indigo-500 animate-pulse"></div>
                </div>
              </div>
            </div>
          </section>

          {/* NumPy style AST tree structure directory explorer */}
          <section id="explorer" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 border-t border-slate-900/60">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Description */}
              <div className="lg:col-span-5 space-y-6">
                <h2 className="text-3xl font-extrabold text-white tracking-tight">Hierarchical AST Document Indexing</h2>
                <p className="text-slate-400 leading-relaxed text-sm font-sans">
                  Unlike traditional chunk database setups, ApexRAG converts files to strict hierarchical AST structures, matching outlines elements. Toggle nested node directories below to trace semantic structures.
                </p>
                <div className="space-y-3.5">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-350 font-sans">Retains outline nodes context, sections metadata, and layout dependencies.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-350 font-sans">Structures tables intact instead of splitting rows across chunks.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-350 font-sans">Leverages directed causal edges to walk related footnotes or variables.</span>
                  </div>
                </div>
              </div>

              {/* Collapsible Tree Explorer */}
              <div className="lg:col-span-7 bg-slate-900/20 border border-slate-800/80 p-6 sm:p-8 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* File outline index tree selector */}
                <div className="space-y-1 font-mono text-[11px]">
                  <span className="text-slate-500 font-bold block mb-4 tracking-wider">AST FILE TREE INDEX</span>
                  
                  {/* ROOT node */}
                  <div className="space-y-1">
                    <div 
                      className={`flex items-center gap-1.5 cursor-pointer p-1.5 rounded hover:bg-slate-900/50 ${activeNodeId === 'ROOT' ? 'text-indigo-400 bg-slate-900/30 font-semibold' : 'text-slate-300'}`}
                      onClick={() => setActiveNodeId('ROOT')}
                    >
                      <button onClick={(e) => { e.stopPropagation(); toggleNodeExpand('ROOT'); }} className="text-slate-500 p-0.5 cursor-pointer">
                        {expandedNodes['ROOT'] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                      </button>
                      <FolderOpen className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Annual_Report.pdf</span>
                    </div>

                    {/* ROOT Children */}
                    {expandedNodes['ROOT'] && (
                      <div className="pl-4 border-l border-slate-800 space-y-1 mt-0.5">
                        
                        {/* SEC1 Node */}
                        <div>
                          <div 
                            className={`flex items-center gap-1.5 cursor-pointer p-1.5 rounded hover:bg-slate-900/50 ${activeNodeId === 'SEC1' ? 'text-indigo-400 bg-slate-900/30 font-semibold' : 'text-slate-300'}`}
                            onClick={() => setActiveNodeId('SEC1')}
                          >
                            <button onClick={(e) => { e.stopPropagation(); toggleNodeExpand('SEC1'); }} className="text-slate-500 p-0.5 cursor-pointer">
                              {expandedNodes['SEC1'] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                            </button>
                            <Folder className="h-3.5 w-3.5 text-indigo-400" />
                            <span>Section 1 (Summary)</span>
                          </div>

                          {expandedNodes['SEC1'] && (
                            <div className="pl-4 border-l border-slate-800 space-y-1 mt-0.5">
                              <div 
                                className={`flex items-center gap-1.5 cursor-pointer p-1.5 rounded hover:bg-slate-900/50 pl-5 ${activeNodeId === 'PAR1.1' ? 'text-indigo-400 bg-slate-900/30 font-semibold' : 'text-slate-450'}`}
                                onClick={() => setActiveNodeId('PAR1.1')}
                              >
                                <AlignLeft className="h-3.5 w-3.5 text-slate-500" />
                                <span>Paragraph 1.1</span>
                              </div>
                              <div 
                                className={`flex items-center gap-1.5 cursor-pointer p-1.5 rounded hover:bg-slate-900/50 pl-5 ${activeNodeId === 'PAR1.2' ? 'text-indigo-400 bg-slate-900/30 font-semibold' : 'text-slate-455'}`}
                                onClick={() => setActiveNodeId('PAR1.2')}
                              >
                                <AlignLeft className="h-3.5 w-3.5 text-slate-500" />
                                <span>Paragraph 1.2</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* SEC2 Node */}
                        <div>
                          <div 
                            className={`flex items-center gap-1.5 cursor-pointer p-1.5 rounded hover:bg-slate-900/50 ${activeNodeId === 'SEC2' ? 'text-indigo-400 bg-slate-900/30 font-semibold' : 'text-slate-300'}`}
                            onClick={() => setActiveNodeId('SEC2')}
                          >
                            <button onClick={(e) => { e.stopPropagation(); toggleNodeExpand('SEC2'); }} className="text-slate-500 p-0.5 cursor-pointer">
                              {expandedNodes['SEC2'] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                            </button>
                            <FolderOpen className="h-3.5 w-3.5 text-indigo-400" />
                            <span>Section 2 (Financials)</span>
                          </div>

                          {expandedNodes['SEC2'] && (
                            <div className="pl-4 border-l border-slate-800 space-y-1 mt-0.5">
                              <div 
                                className={`flex items-center gap-1.5 cursor-pointer p-1.5 rounded hover:bg-slate-900/50 pl-5 ${activeNodeId === 'TAB2.1' ? 'text-indigo-400 bg-slate-900/30 font-semibold' : 'text-slate-450'}`}
                                onClick={() => setActiveNodeId('TAB2.1')}
                              >
                                <Table className="h-3.5 w-3.5 text-teal-400" />
                                <span>Table 2.1 (Sheet)</span>
                              </div>
                              <div 
                                className={`flex items-center gap-1.5 cursor-pointer p-1.5 rounded hover:bg-slate-900/50 pl-5 ${activeNodeId === 'PAR2.2' ? 'text-indigo-400 bg-slate-900/30 font-semibold' : 'text-slate-450'}`}
                                onClick={() => setActiveNodeId('PAR2.2')}
                              >
                                <AlignLeft className="h-3.5 w-3.5 text-slate-500" />
                                <span>Paragraph 2.2</span>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    )}
                  </div>
                </div>

                {/* AST Details Viewer Card */}
                <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-xl flex flex-col justify-between shadow-lg">
                  <div>
                    {/* Node tabs */}
                    <div className="flex border-b border-slate-850 pb-2 mb-4 gap-3 text-[10px] font-mono">
                      <button 
                        onClick={() => setExplorerTab('metadata')} 
                        className={`font-semibold pb-1 cursor-pointer transition-colors ${explorerTab === 'metadata' ? 'text-indigo-400 border-b border-indigo-500' : 'text-slate-500 hover:text-slate-350'}`}
                      >
                        Metadata
                      </button>
                      <button 
                        onClick={() => setExplorerTab('source')} 
                        className={`font-semibold pb-1 cursor-pointer transition-colors ${explorerTab === 'source' ? 'text-indigo-400 border-b border-indigo-500' : 'text-slate-500 hover:text-slate-350'}`}
                      >
                        Source View
                      </button>
                      <button 
                        onClick={() => setExplorerTab('graph')} 
                        className={`font-semibold pb-1 cursor-pointer transition-colors ${explorerTab === 'graph' ? 'text-indigo-400 border-b border-indigo-500' : 'text-slate-500 hover:text-slate-350'}`}
                      >
                        Causal Graph
                      </button>
                    </div>

                    {/* Metadata view */}
                    {explorerTab === 'metadata' && (
                      <div className="space-y-4">
                        <div>
                          <span className="text-[9px] font-mono text-teal-400 uppercase tracking-widest font-semibold">{activeNode.type}</span>
                          <h4 className="text-xs font-bold text-slate-200 mt-0.5">{activeNode.title}</h4>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{activeNode.summary}</p>
                        
                        <div className="space-y-1 pt-3 border-t border-slate-850 font-mono text-[9px] text-slate-500">
                          {Object.keys(activeNode.metadata).map(k => (
                            <div key={k} className="flex justify-between">
                              <span className="text-slate-550">{k}:</span>
                              <span className="text-slate-350 font-semibold">{activeNode.metadata[k]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Source content view */}
                    {explorerTab === 'source' && (
                      <div className="space-y-3 font-mono text-[10px] leading-relaxed text-indigo-300">
                        {activeNode.type === 'table' ? (
                          renderTableHTML(activeNode.content)
                        ) : (
                          <pre className="whitespace-pre-wrap code-scrollbar overflow-y-auto max-h-[160px] bg-slate-950/60 p-3 rounded-lg border border-slate-850">
                            {activeNode.content}
                          </pre>
                        )}
                      </div>
                    )}

                    {/* Causal Node graph view */}
                    {explorerTab === 'graph' && (
                      <div className="flex flex-col items-center justify-center py-4 bg-slate-950/40 border border-slate-850 rounded-lg p-2 min-h-[160px]">
                        <svg viewBox="0 0 200 120" className="w-full max-w-[180px]">
                          <defs>
                            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                              <path d="M 0 2 L 10 5 L 0 8 z" fill="#6366f1" />
                            </marker>
                          </defs>
                          
                          {/* ROOT Node */}
                          <circle cx="100" cy="20" r="10" fill="#1e293b" stroke="#6366f1" strokeWidth="1" />
                          <text x="100" y="23" fill="#ffffff" fontSize="6" fontFamily="monospace" textAnchor="middle">ROOT</text>
                          
                          {/* SEC2 Node */}
                          <circle cx="50" cy="60" r="10" fill="#1e293b" stroke="#6366f1" strokeWidth="1" />
                          <text x="50" y="63" fill="#ffffff" fontSize="6" fontFamily="monospace" textAnchor="middle">SEC2</text>
                          
                          {/* TAB2.1 Node */}
                          <circle cx="30" cy="100" r="10" fill="#1e293b" stroke="#14b8a6" strokeWidth="1" />
                          <text x="30" y="103" fill="#ffffff" fontSize="5" fontFamily="monospace" textAnchor="middle">TAB2.1</text>
                          
                          {/* PAR2.2 Node */}
                          <circle cx="70" cy="100" r="10" fill="#1e293b" stroke="#8b5cf6" strokeWidth="1" />
                          <text x="70" y="103" fill="#ffffff" fontSize="5" fontFamily="monospace" textAnchor="middle">PAR2.2</text>
                          
                          {/* Connectors */}
                          <line x1="88" y1="28" x2="62" y2="52" stroke="#1e293b" strokeWidth="0.8" markerEnd="url(#arrow)" />
                          <line x1="45" y1="70" x2="35" y2="90" stroke="#1e293b" strokeWidth="0.8" markerEnd="url(#arrow)" />
                          <line x1="55" y1="70" x2="65" y2="90" stroke="#1e293b" strokeWidth="0.8" markerEnd="url(#arrow)" />
                          
                          {/* Causal edge (Paragraph references Table) */}
                          <path d="M 60 100 Q 50 95 40 100" fill="none" stroke="#6366f1" strokeWidth="0.8" strokeDasharray="2,2" markerEnd="url(#arrow)" />
                          <text x="50" y="93" fill="#6366f1" fontSize="4.5" textAnchor="middle">REFERENCES</text>
                        </svg>
                        <span className="text-[8px] font-mono text-slate-500 mt-2">Active Node Links: GraphEdgeData loaded.</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-850/80 mt-4 flex items-center justify-between text-[9px] font-mono text-slate-550">
                    <span>ID: node_{activeNode.id.toLowerCase()}</span>
                    <span className="text-indigo-400">Indexed: True</span>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Code Playground SDK snippets switcher */}
          <section id="playground" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 border-t border-slate-900/60">
            <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Built for Developers</h2>
              <p className="text-slate-400 text-sm">Flexible developer API endpoints supporting queries, token streaming, temporal histories, and access scopes.</p>
            </div>

            <div className="glow-border bg-slate-900/40 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl flex flex-col md:flex-row">
              
              {/* Tab Selector */}
              <div className="md:w-64 border-b md:border-b-0 md:border-r border-slate-800/80 bg-slate-950/40 font-medium text-xs flex flex-col p-4 space-y-2">
                <button 
                  onClick={() => setCodeTab('quick')} 
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${codeTab === 'quick' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'}`}
                >
                  <Play className="h-4 w-4" /> Quick Start
                </button>
                <button 
                  onClick={() => setCodeTab('stream')} 
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${codeTab === 'stream' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'}`}
                >
                  <Radio className="h-4 w-4" /> Token Streaming
                </button>
                <button 
                  onClick={() => setCodeTab('temporal')} 
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${codeTab === 'temporal' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'}`}
                >
                  <History className="h-4 w-4" /> Temporal Time-Travel
                </button>
                <button 
                  onClick={() => setCodeTab('rbac')} 
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${codeTab === 'rbac' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'}`}
                >
                  <ShieldAlert className="h-4 w-4" /> Enterprise RBAC
                </button>
                <button 
                  onClick={() => setCodeTab('graph')} 
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${codeTab === 'graph' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'}`}
                >
                  <Network className="h-4 w-4" /> Causal Graph
                </button>
              </div>

              {/* Code Panel */}
              <div className="flex-1 flex flex-col min-w-0 bg-slate-950/80">
                <div className="px-5 py-3 border-b border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Python 3.10+ SDK Client</span>
                  <button 
                    onClick={copyCodePlayground} 
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-slate-900 hover:bg-slate-855 text-slate-400 hover:text-white border border-slate-800 cursor-pointer transition-colors"
                  >
                    {codeCopied ? <Check className="h-3.5 w-3.5 text-teal-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{codeCopied ? 'Copied' : 'Copy Snippet'}</span>
                  </button>
                </div>
                <div className="p-6 overflow-x-auto code-scrollbar font-mono text-xs leading-relaxed text-slate-350 bg-slate-950/40">
                  <pre className="whitespace-pre">{codeSnippets[codeTab]}</pre>
                </div>
              </div>

            </div>
          </section>

          {/* Architecture comparison */}
          <section id="comparisons" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 border-t border-slate-900/60">
            <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">How it Compares</h2>
              <p className="text-slate-400 text-sm">Why vector similarity chunk searches fail on hierarchical data, and how AST trees fix it.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              <div className="p-8 rounded-2xl border border-red-500/10 bg-red-950/5 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wider font-mono">Traditional Vector RAG</span>
                  <h3 className="text-xl font-bold text-slate-200 mt-4 mb-3">Naïve Embedding Chunking</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6 font-sans">Split documents blindly into 512-token overlap blocks. Relies entirely on semantic math distance matching.</p>
                  <ul className="space-y-4 text-xs text-slate-400 font-sans">
                    <li className="flex items-start gap-3"><XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" /><span>Chops tables across margins, corrupting row linkages.</span></li>
                    <li className="flex items-start gap-3"><XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" /><span>Loses outline structural relationships completely.</span></li>
                    <li className="flex items-start gap-3"><XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" /><span>Hallucination hazard on queries needing aggregate calculations.</span></li>
                  </ul>
                </div>
                <div className="pt-8 border-t border-slate-800/10 mt-8 text-[10px] font-mono text-red-400">Result: Hallucination risks on structured tables.</div>
              </div>

              <div className="p-8 rounded-2xl border border-teal-500/10 bg-teal-950/5 relative overflow-hidden glow-border flex flex-col justify-between">
                <div>
                  <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 uppercase tracking-wider font-mono">ApexRAG Engine</span>
                  <h3 className="text-xl font-bold text-slate-200 mt-4 mb-3">Universal Outlined AST Tree</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6 font-sans">Parses document layouts into nested outlines models. Traverses structural trees using coordinate agents.</p>
                  <ul className="space-y-4 text-xs text-slate-400 font-sans">
                    <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" /><span>Preserves tables, outlines, and header links intact.</span></li>
                    <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" /><span>Coordinate agents read Signposts summaries prior to traversing branches.</span></li>
                    <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" /><span>Strict leaf verification blocks hallucinated responses.</span></li>
                  </ul>
                </div>
                <div className="pt-8 border-t border-slate-800/10 mt-8 text-[10px] font-mono text-teal-400">Result: 94.2% verified retrieval accuracy.</div>
              </div>
            </div>
          </section>

          {/* vLLM style interactive installation command builder */}
          <section id="installer" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 border-t border-slate-900/60">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Description */}
              <div className="lg:col-span-5 space-y-6">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Dynamic Build Configurator</h2>
                <p className="text-slate-400 leading-relaxed text-sm font-sans">
                  Customize the installer dependencies matrix to include web dashboard interfaces, distributed Postgres servers, vector models, or telemetry agents.
                </p>
                <div className="text-xs text-slate-550 space-y-2 font-sans">
                  <p>💡 Compatible with Python 3.10, 3.11, and 3.12 environments.</p>
                  <p>🔧 Auto-configures installation tags for direct terminal execution.</p>
                </div>
              </div>

              {/* Selector matrix panel */}
              <div className="lg:col-span-7 bg-slate-900/30 border border-slate-800/80 p-6 sm:p-8 rounded-2xl space-y-6 shadow-2xl">
                <div className="space-y-4 text-xs font-semibold font-mono">
                  
                  {/* Release */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-3">
                    <span className="text-slate-500 uppercase tracking-wider text-[10px]">Build Target</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setRelease('stable')} 
                        className={`px-3 py-1.5 rounded text-[10px] cursor-pointer transition-all border ${release === 'stable' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-450 hover:text-white'}`}
                      >
                        Stable (v1.0.3)
                      </button>
                      <button 
                        onClick={() => setRelease('nightly')} 
                        className={`px-3 py-1.5 rounded text-[10px] cursor-pointer transition-all border ${release === 'nightly' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-455 hover:text-white'}`}
                      >
                        Nightly (v1.1.0-dev)
                      </button>
                    </div>
                  </div>

                  {/* Package Source */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-3">
                    <span className="text-slate-500 uppercase tracking-wider text-[10px]">Package Source</span>
                    <div className="flex gap-2">
                      {['pip', 'conda', 'source'].map(src => (
                        <button 
                          key={src}
                          onClick={() => setSource(src)} 
                          className={`px-3 py-1.5 rounded capitalize text-[10px] cursor-pointer transition-all border ${source === src ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-455 hover:text-white'}`}
                        >
                          {src}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* LLM providers */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-3">
                    <span className="text-slate-500 uppercase tracking-wider text-[10px]">LLM Provider Client</span>
                    <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                      {['openai', 'anthropic', 'groq', 'ollama', 'none'].map(p => (
                        <button 
                          key={p}
                          onClick={() => setProvider(p)} 
                          className={`px-2.5 py-1.5 rounded capitalize text-[10px] cursor-pointer transition-all border ${provider === p ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-455 hover:text-white'}`}
                        >
                          {p === 'none' ? 'None (Offline)' : p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional modules checkboxes */}
                  <div className="flex flex-col gap-2.5">
                    <span className="text-slate-500 uppercase tracking-wider text-[10px]">Optional Extras & Extensions</span>
                    <div className="grid grid-cols-2 gap-3 pt-1 text-[11px] font-sans">
                      <label className="flex items-center gap-2.5 cursor-pointer text-slate-350 select-none">
                        <input 
                          type="checkbox" 
                          checked={extras.web} 
                          onChange={() => handleExtraToggle('web')}
                          className="accent-indigo-500 h-4 w-4 rounded border-slate-850 bg-slate-950" 
                        />
                        <span>FastAPI REST Server `[web]`</span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer text-slate-350 select-none">
                        <input 
                          type="checkbox" 
                          checked={extras.postgres} 
                          onChange={() => handleExtraToggle('postgres')}
                          className="accent-indigo-500 h-4 w-4 rounded border-slate-855 bg-slate-950" 
                        />
                        <span>Postgres Connector `[postgres]`</span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer text-slate-350 select-none">
                        <input 
                          type="checkbox" 
                          checked={extras.vectors} 
                          onChange={() => handleExtraToggle('vectors')}
                          className="accent-indigo-500 h-4 w-4 rounded border-slate-855 bg-slate-950" 
                        />
                        <span>Local Vector Embeddings `[vectors]`</span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer text-slate-350 select-none">
                        <input 
                          type="checkbox" 
                          checked={extras.telemetry} 
                          onChange={() => handleExtraToggle('telemetry')}
                          className="accent-indigo-500 h-4 w-4 rounded border-slate-855 bg-slate-950" 
                        />
                        <span>OpenTelemetry Traces `[telemetry]`</span>
                      </label>
                    </div>
                  </div>

                </div>

                {/* Outputs command and active deps listing */}
                <div className="pt-6 border-t border-slate-800/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Dynamic Install Command</span>
                    <button 
                      onClick={copyInstallerCommand} 
                      className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-350 cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5" /> Copy Command
                    </button>
                  </div>
                  <pre className="bg-slate-950 p-4 rounded-lg font-mono text-xs border border-slate-800 text-indigo-200 overflow-x-auto code-scrollbar leading-relaxed">
                    {getInstallerCommand()}
                  </pre>

                  {/* Active dependencies tag badges */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold block">Dependencies to be installed:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeDependencies.map(dep => (
                        <span key={dep} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-850 text-slate-400 font-mono text-[9px]">
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </section>

          {/* Full CLI commands list */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 border-t border-slate-900/60">
            <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Command-Line Diagnostics</h2>
              <p className="text-slate-400 text-sm">ApexRAG ships with detailed CLI utilities to serve REST APIs or check local database models.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
              <div className="p-5 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <span className="text-indigo-400 font-bold">$ python -m apex_rag serve</span>
                <p className="text-slate-455 font-sans text-xs">Runs the FastAPI production web server complete with auth keys and rate limits.</p>
              </div>
              <div className="p-5 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <span className="text-indigo-400 font-bold">$ python -m apex_rag ingest &lt;file&gt;</span>
                <p className="text-slate-455 font-sans text-xs">Ingests PDFs or directories structurally, converting pages into database outline nodes.</p>
              </div>
              <div className="p-5 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <span className="text-indigo-400 font-bold">$ python -m apex_rag query &lt;doc_id&gt; &lt;q&gt;</span>
                <p className="text-slate-455 font-sans text-xs">Queries outline targets using coordinated agent walks and prints citations.</p>
              </div>
              <div className="p-5 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <span className="text-indigo-400 font-bold">$ python -m apex_rag repl</span>
                <p className="text-slate-455 font-sans text-xs">Launches the interactive shell console to test and debug agent paths visually.</p>
              </div>
              <div className="p-5 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <span className="text-indigo-400 font-bold">$ python -m apex_rag doctor</span>
                <p className="text-slate-455 font-sans text-xs">Validates system credentials, connection states, database bindings, and OpenAI endpoints.</p>
              </div>
              <div className="p-5 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <span className="text-indigo-400 font-bold">$ python -m apex_rag info</span>
                <p className="text-slate-455 font-sans text-xs">Prints version metadata, configurations, database metrics, and caching summaries.</p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── DOCUMENTATION PORTAL VIEW (Triple-Column Layout) ────────────────── */}
      {viewMode === 'docs' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10 flex flex-col lg:flex-row gap-8">
          
          {/* 1. Left Sidebar Navigation Column */}
          <aside className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="lg:sticky lg:top-24 space-y-5">
              
              {/* Category list with accordions */}
              <div className="space-y-4">
                {Object.keys(accordionState).map(category => {
                  const docsInCat = docsByCategory[category] || [];
                  const isOpen = accordionState[category];
                  if (docsInCat.length === 0) return null;

                  return (
                    <div key={category} className="space-y-1.5 border-b border-slate-900 pb-3 last:border-0">
                      <button 
                        onClick={() => toggleAccordion(category)}
                        className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono hover:text-slate-350 cursor-pointer"
                      >
                        <span>{category}</span>
                        {isOpen ? <ChevronDown className="h-3 w-3 text-slate-500" /> : <ChevronRight className="h-3 w-3 text-slate-500" />}
                      </button>
                      
                      {isOpen && (
                        <ul className="space-y-1 pl-1">
                          {docsInCat.map(doc => (
                            <li key={doc.id}>
                              <button 
                                onClick={() => { setSelectedDocId(doc.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between group cursor-pointer transition-all ${
                                  selectedDocId === doc.id 
                                    ? 'bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500 pl-2.5 font-bold' 
                                    : 'text-slate-400 hover:bg-slate-900/40 hover:text-white'
                                }`}
                              >
                                <span className="truncate">{doc.title}</span>
                                <ChevronRight className={`h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ${
                                  selectedDocId === doc.id ? 'opacity-100 text-indigo-400' : 'text-slate-650'
                                }`} />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* 2. Middle Main Document Reader Column */}
          <main className="flex-1 min-w-0 bg-slate-900/10 border border-slate-800/80 p-6 md:p-8 rounded-2xl shadow-xl min-h-[500px]">
            <article className="prose prose-invert max-w-none">
              
              {/* Category Breadcrumbs */}
              <div className="flex items-center gap-1 text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-semibold mb-3 select-none">
                <span>{activeDoc.category}</span>
                <ChevronRight className="h-3 w-3 text-slate-600" />
                <span className="text-slate-400">{activeDoc.title}</span>
              </div>
              
              <h1 className="text-3xl font-extrabold text-white tracking-tight mb-4 border-b border-slate-800 pb-3 font-sans">
                {activeDoc.title}
              </h1>
              
              {/* Page description */}
              {activeDoc.summary && (
                <p className="text-sm text-slate-400 italic mb-6 border-l-2 border-slate-800 pl-3">
                  {activeDoc.summary}
                </p>
              )}

              {/* Parsed HTML content */}
              <div 
                className="prose-content text-slate-400 font-sans text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: activeDoc.html }} 
              />
            </article>

            {/* Bottom sequential paging controls */}
            <div className="flex items-center justify-between border-t border-slate-850 mt-12 pt-6 font-semibold text-xs">
              <div>
                {prevPage && (
                  <button 
                    onClick={() => { setSelectedDocId(prevPage.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="flex flex-col items-start gap-1 group cursor-pointer text-slate-450 hover:text-white transition-colors"
                  >
                    <span className="text-[10px] text-slate-600 uppercase font-mono tracking-wider">Previous</span>
                    <span className="flex items-center gap-1 text-indigo-400 group-hover:text-indigo-300">
                      <ArrowLeft className="h-3.5 w-3.5" />
                      {prevPage.title}
                    </span>
                  </button>
                )}
              </div>
              <div>
                {nextPage && (
                  <button 
                    onClick={() => { setSelectedDocId(nextPage.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="flex flex-col items-end gap-1 group cursor-pointer text-slate-450 hover:text-white transition-colors"
                  >
                    <span className="text-[10px] text-slate-600 uppercase font-mono tracking-wider">Next</span>
                    <span className="flex items-center gap-1 text-indigo-400 group-hover:text-indigo-300">
                      {nextPage.title}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </button>
                )}
              </div>
            </div>
          </main>

          {/* 3. Right Sidebar TOC Anchor Index Spy */}
          <aside className="hidden xl:block w-56 shrink-0">
            <div className="sticky top-24 space-y-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono pl-3">
                On This Page
              </span>
              
              {activeDoc.headings && activeDoc.headings.length > 0 ? (
                <ul className="space-y-1.5 border-l border-slate-900 font-medium text-[11px]">
                  {activeDoc.headings.map((heading) => {
                    const isActive = activeHeadingId === heading.id;
                    
                    return (
                      <li key={heading.id} className={heading.level === 3 ? 'pl-4' : 'pl-0'}>
                        <a 
                          href={`#${heading.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            const target = document.getElementById(heading.id);
                            if (target) {
                              target.scrollIntoView({ behavior: 'smooth' });
                              setActiveHeadingId(heading.id);
                            }
                          }}
                          className={`block py-1 px-3 border-l -ml-[1px] transition-all truncate hover:text-white ${
                            isActive 
                              ? 'border-indigo-500 text-indigo-400 font-bold bg-indigo-500/5' 
                              : 'border-transparent text-slate-500'
                          }`}
                        >
                          {heading.text}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <span className="text-[10px] font-mono text-slate-600 italic pl-3">No sections on page.</span>
              )}
            </div>
          </aside>

        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-12 relative z-10 text-slate-500 text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center">
              <Network className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-sm text-slate-400">ApexRAG Engine</span>
          </div>
          
          <div className="flex gap-6">
            <a href="https://github.com/abinivas-17/apex-rag" className="hover:text-slate-350 transition-colors">GitHub Repository</a>
            <a href="https://pypi.org/project/apex-rag/" className="hover:text-slate-350 transition-colors">PyPI Releases</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setViewMode('docs'); setSelectedDocId('architecture'); }} className="hover:text-slate-350 transition-colors">Architecture Overview</a>
          </div>
          
          <div>
            <span>&copy; 2026 G S Abinivas. MIT Licensed.</span>
          </div>
        </div>
      </footer>

      {/* Algolia-like full-text Search Modal Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4 sm:px-6 animate-fade-in">
          
          {/* Modal box */}
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[480px] animate-scale-up">
            
            {/* Search Input field */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800/80 bg-slate-950/40">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search titles, sections, or content variables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-xs text-slate-200 outline-none w-full placeholder-slate-500 font-medium"
              />
              <button 
                onClick={() => setSearchOpen(false)}
                className="text-[10px] font-mono text-slate-500 border border-slate-800 px-1.5 py-0.5 rounded hover:text-white cursor-pointer"
              >
                ESC
              </button>
            </div>

            {/* Results listing */}
            <div className="flex-1 overflow-y-auto p-4 code-scrollbar space-y-4">
              {filteredDocKeys.length > 0 ? (
                // Group filtered results by category in search results
                Object.keys(
                  filteredDocKeys.reduce((acc, k) => {
                    const d = documentationDb[k];
                    if (!acc[d.category]) acc[d.category] = [];
                    acc[d.category].push(d);
                    return acc;
                  }, {})
                ).map(category => (
                  <div key={category} className="space-y-1.5">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block font-mono pl-2">
                      {category}
                    </span>
                    <div className="space-y-1">
                      {filteredDocKeys
                        .map(k => documentationDb[k])
                        .filter(d => d.category === category)
                        .map(doc => (
                          <button
                            key={doc.id}
                            onClick={() => {
                              setSelectedDocId(doc.id);
                              setSearchOpen(false);
                              setViewMode('docs');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-full text-left p-3 rounded-lg bg-slate-950/20 hover:bg-indigo-600/10 border border-slate-850 hover:border-indigo-500/30 flex justify-between items-center group cursor-pointer transition-all"
                          >
                            <div>
                              <h4 className="text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">
                                {doc.title}
                              </h4>
                              <p className="text-[10px] text-slate-500 mt-1 font-sans line-clamp-1">
                                {doc.summary}
                              </p>
                            </div>
                            <ChevronRight className="h-3.5 w-3.5 text-slate-650 group-hover:text-indigo-400 transition-colors" />
                          </button>
                        ))
                      }
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 flex flex-col items-center justify-center">
                  <XCircle className="h-8 w-8 text-slate-700 mb-2 animate-bounce" />
                  <span className="text-xs text-slate-500 font-mono">No matching documentation entries.</span>
                </div>
              )}
            </div>

            {/* Modal search footer instructions */}
            <div className="px-4 py-2 bg-slate-950/50 border-t border-slate-800/80 text-[9px] font-mono text-slate-500 flex justify-between">
              <span>Use keywords to filter</span>
              <span>Press ESC to close</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;
