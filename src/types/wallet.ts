import { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";

export interface WalletAdapter {
  publicKey: PublicKey;
  signTransaction(tx: Transaction | VersionedTransaction): Promise<Transaction | VersionedTransaction>;
  signAllTransactions(txs: (Transaction | VersionedTransaction)[]): Promise<(Transaction | VersionedTransaction)[]>;
  // Add session support
  sessionId?: string;
  sessionSignature?: string;
  originalSignature?: string;
}

export interface WalletCredentials {
  publicKey: string;
  signature?: string;
  sessionProof?: string;
  sessionSignature?: string;
  sessionId?: string;
  credentials?: {
    publicKey: string;
    signature?: string;
    sessionSignature?: string;
    signTransaction?: boolean;
    signAllTransactions?: boolean;
    connected?: boolean;
  };
}

export interface SessionManager {
  initSession(wallet: WalletCredentials): Promise<{
    success: boolean;
    sessionId?: string;
    sessionSignature?: string;
    error?: string;
  }>;
  validateSession(wallet: WalletCredentials): Promise<boolean>;
  refreshSession?(wallet: WalletCredentials): Promise<boolean>;
}

// This will help us adapt different wallet providers
export class WebWalletAdapter implements WalletAdapter {
  constructor(
    public publicKey: PublicKey,
    private signer: {
      signTransaction: (tx: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>;
      signAllTransactions: (txs: (Transaction | VersionedTransaction)[]) => Promise<(Transaction | VersionedTransaction)[]>;
    },
    public sessionId?: string,
    public sessionSignature?: string,
    public originalSignature?: string
  ) {}

  async signTransaction(tx: Transaction | VersionedTransaction): Promise<Transaction | VersionedTransaction> {
    return this.signer.signTransaction(tx);
  }

  async signAllTransactions(txs: (Transaction | VersionedTransaction)[]): Promise<(Transaction | VersionedTransaction)[]> {
    return this.signer.signAllTransactions(txs);
  }
}