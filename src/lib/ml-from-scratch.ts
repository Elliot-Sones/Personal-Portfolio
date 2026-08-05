export interface MfsModel {
  slug: string;
  name: string;
  short: string;
  task: string;
  accuracy: string;
  gif: string;
  gifCaption: string;
  facts: { label: string; value: string }[];
  story: string[];
  demoUrl: string;
  embedUrl: string;
  demoNote: string;
  nativeDemo?: boolean;
  code: { label: string; href: string }[];
}

const REPO = "https://github.com/Elliot-Sones/Neural_Networks_Fundamentals";

export const mfsIntro = {
  title: "Machine Learning, from scratch",
  description:
    "Frameworks hide exactly the parts you should understand, so I built the parts. Every major architecture implemented from first principles with no high-level ML wrappers, each with a live demo you can try right on the page.",
  repo: REPO,
  transformersRepo: "https://github.com/Elliot-Sones/Transformers",
};

export const mfsModels: MfsModel[] = [
  {
    slug: "mlp",
    name: "Multi-Layer Perceptron",
    short: "MLP",
    task: "MNIST digit classification (0-9)",
    accuracy: "97%+",
    gif: "/ml-from-scratch/mlp-demo.gif",
    gifCaption: "Drawing a digit and watching the network call it",
    facts: [
      { label: "Goal", value: "Accurately predict hand-drawn digits in production" },
      { label: "Dataset", value: "MNIST 28×28 grayscale images (60k train / 10k test)" },
      { label: "Architecture", value: "784 → 256 → 128 → 10 with ReLU, Adam, He init, L2 regularization" },
      { label: "Result", value: "97%+ test accuracy" },
    ],
    story: [
      "This is where the series starts: a network built in pure NumPy. Forward pass, backprop, Adam, weight init, regularization, all written by hand. Backprop stops being magic around the third time you derive it.",
      "The model below is the exact one from the repo, running live. Draw a digit and it will tell you what it sees.",
    ],
    demoUrl: "https://huggingface.co/spaces/Eli181927/elliot_digit_classifier/",
    embedUrl: "https://eli181927-elliot-digit-classifier.hf.space",
    demoNote: "Draw a digit from 0 to 9",
    nativeDemo: true,
    code: [
      { label: "Training code", href: `${REPO}/blob/main/1.MLP/training.py` },
      { label: "Section README", href: `${REPO}/blob/main/1.MLP/README.md` },
    ],
  },
  {
    slug: "cnn",
    name: "Convolutional Neural Network",
    short: "CNN",
    task: "Two-digit classification (0-99)",
    accuracy: "97.88%",
    gif: "/ml-from-scratch/cnn-demo.gif",
    gifCaption: "Two digits in, one of a hundred classes out",
    facts: [
      { label: "Goal", value: "Scale digit recognition to two-digit numbers (0-99)" },
      { label: "Dataset", value: "Paired-MNIST 28×56 images (concatenated digits, 00-99 labels)" },
      {
        label: "Architecture",
        value: "Conv(3×3,16) → ReLU → MaxPool → Conv(3×3,32) → ReLU → MaxPool → FC(256) → Dropout(0.4) → FC(100)",
      },
      { label: "Result", value: "97.88% test accuracy (10,000 samples)" },
    ],
    story: [
      "Same task, harder version: one hundred classes instead of ten. Convolutions written from scratch in NumPy first, then the same model in PyTorch to compare, which makes it very clear what the framework is actually doing for you.",
      "Write a two-digit number below and see how it reads it.",
    ],
    demoUrl: "https://huggingface.co/spaces/Eli181927/0-99_Classification",
    embedUrl: "https://eli181927-0-99-classification.hf.space",
    demoNote: "Draw a two-digit number from 00 to 99",
    code: [
      { label: "Training code", href: `${REPO}/blob/main/2.CNN/training_torch.py` },
      { label: "Section README", href: `${REPO}/blob/main/2.CNN/README.md` },
    ],
  },
  {
    slug: "rnn",
    name: "Recurrent Neural Network",
    short: "RNN",
    task: "Doodle classification (10 animals)",
    accuracy: "94.36%",
    gif: "/ml-from-scratch/rnn-demo.gif",
    gifCaption: "Stroke by stroke, the network guesses the animal",
    facts: [
      { label: "Goal", value: "Classify hand-drawn doodles into 10 animal classes" },
      { label: "Dataset", value: "Google Quick, Draw! stroke sequences (dx, dy, pen-lift)" },
      {
        label: "Architecture",
        value: "2-layer bidirectional GRU (hidden 192), AdamW, label smoothing, dropout",
      },
      { label: "Result", value: "94.36% top-1 accuracy (188,779 test samples)" },
    ],
    story: [
      "Doodles are sequences, not pictures: the input is the pen's movement over time (dx, dy, pen-lift), so the model has to remember what it has seen. That is exactly the job recurrent networks were built for.",
      "Doodle one of the ten animals below and watch it guess while you draw.",
    ],
    demoUrl: "https://huggingface.co/spaces/Eli181927/Classification-doodle-RNN",
    embedUrl: "https://eli181927-classification-doodle-rnn.hf.space",
    demoNote: "Doodle a cat, dog, fish, bird, and more",
    code: [
      { label: "Training code", href: `${REPO}/blob/main/3.RNN/training-doodle.py` },
      { label: "Section README", href: `${REPO}/blob/main/3.RNN/README.md` },
    ],
  },
  {
    slug: "transformer",
    name: "Transformers",
    short: "Transformer",
    task: "Emotion, Shakespeare, EN→FR translation",
    accuracy: "~92%",
    gif: "/ml-from-scratch/encoder-demo.gif",
    gifCaption: "Emotion analysis with the encoder",
    facts: [
      { label: "Paper", value: '"Attention Is All You Need", re-implemented end to end' },
      { label: "Encoder", value: "6-class emotion classification + masked language modeling" },
      { label: "Decoder", value: "Character-level Shakespeare generation (a small GPT)" },
      { label: "Seq2Seq", value: "Full encoder-decoder translating English to French" },
    ],
    story: [
      "The finale: the Transformer from the paper, built three times with increasing ambition. First an encoder for emotion analysis, then a decoder-only model that is essentially a small GPT trained on Shakespeare, and finally the full encoder-decoder doing English to French translation.",
      "The demo below has all three in tabs: classify an emotion, generate some Shakespeare, or translate a sentence.",
    ],
    demoUrl: "https://huggingface.co/spaces/Eli181927/Transformer_Demo",
    embedUrl: "https://eli181927-transformer-demo.hf.space",
    demoNote: "Three tabs: emotion, Shakespeare, translation",
    code: [
      { label: "Transformer suite", href: `${REPO}/tree/main/4.Transformers` },
      { label: "Deep-dive repo", href: "https://github.com/Elliot-Sones/Transformers" },
    ],
  },
];

export const mfsData = [
  {
    model: "MLP",
    dataset: "MNIST (28×28, digits 0-9)",
    source: { label: "CVDF mirror", href: "https://storage.googleapis.com/cvdf-datasets/mnist" },
  },
  {
    model: "CNN",
    dataset: "MNIST-100 (28×56, digits 0-99)",
    source: { label: "Paired from MNIST", href: null },
  },
  {
    model: "RNN",
    dataset: "Quick, Draw! (10 animals)",
    source: {
      label: "Google Quick Draw",
      href: "https://storage.googleapis.com/quickdraw_dataset/full/simplified/",
    },
  },
  {
    model: "Transformer",
    dataset: "Tiny Shakespeare · GoEmotions · WMT14 EN-FR",
    source: { label: "Various", href: null },
  },
];

export function getMfsModel(slug: string): MfsModel | undefined {
  return mfsModels.find((m) => m.slug === slug);
}
