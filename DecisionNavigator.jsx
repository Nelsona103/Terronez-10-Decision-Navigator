import React, { useState, useEffect } from 'react';
import { Volume2, HelpCircle, Award, Target, Clock, BookOpen, GraduationCap, Play, Pause, StopCircle, PlusCircle, Scale, Sliders, TrendingUp, CheckCircle, Eye } from 'lucide-react';

const DecisionNavigator = () => {
  const [gamePhase, setGamePhase] = useState('welcome');
  const [currentScenario, setCurrentScenario] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [showDefinitions, setShowDefinitions] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [finalWriting, setFinalWriting] = useState('');
  
  // Feedback state variables
  const [showingFeedback, setShowingFeedback] = useState(false);
  const [feedbackState, setFeedbackState] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Interactive element states
  const [pauseComplete, setPauseComplete] = useState(false);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingCount, setBreathingCount] = useState(5);
  const [impulseLevel, setImpulseLevel] = useState(8);
  const [stopSignClicked, setStopSignClicked] = useState(false);
  
  // Consider step states (updated for pre-defined options)
  const [selectedOptionForWhatIf, setSelectedOptionForWhatIf] = useState('');
  
  // Evaluate step states
  const [scalePositions, setScalePositions] = useState({});
  
  // Choose step states
  const [confidenceLevel, setConfidenceLevel] = useState(5);
  const [finalChoice, setFinalChoice] = useState('');
  
  // Reflect step states
  const [reflectionText, setReflectionText] = useState('');
  const [growthPoints, setGrowthPoints] = useState(0);

  // Process vocabulary with definitions (5-step model)
  const processVerbs = {
    pause: {
      definition: "To stop and think before reacting",
      emoji: "⏸️",
      audio: "PAWZ"
    },
    consider: {
      definition: "To think about what choices I have",
      emoji: "🤔",
      audio: "con-SID-er"
    },
    evaluate: {
      definition: "To judge which choice is best by asking important questions",
      emoji: "⚖️", 
      audio: "ee-VAL-you-ate",
      scaffoldPrompts: [
        "Which choice helps others most?",
        "Which follows our Terronez 10 principles?",
        "Which choice am I most proud of?",
        "Which choice shows respect?",
        "Which choice helps me learn and grow?"
      ]
    },
    choose: {
      definition: "To make my decision and commit to it",
      emoji: "✅",
      audio: "CHOOZ"
    },
    reflect: {
      definition: "To think about what happened and what I learned",
      emoji: "🪞",
      audio: "ree-FLEKT"
    }
  };

  // Warm-up questions (5-step model)
  const warmupQuestions = [
    {
      question: "When you stop and think before reacting to a situation, you _____ first.",
      options: ["pause", "choose", "rush"],
      correct: "pause",
      points: 10
    },
    {
      question: "When you think about what choices you have, you _____ your options.",
      options: ["ignore", "consider", "avoid"],
      correct: "consider",
      points: 10
    },
    {
      question: "When you ask 'Which choice helps others most?' you are learning to _____ your options.",
      options: ["evaluate", "hide", "forget"],
      correct: "evaluate",
      points: 10
    },
    {
      question: "When you make your decision and commit to it, you _____ your path.",
      options: ["avoid", "choose", "delay"],
      correct: "choose",
      points: 10
    },
    {
      question: "When you think about what happened and what you learned, you _____ on the experience.",
      options: ["reflect", "ignore", "forget"],
      correct: "reflect",
      points: 10
    }
  ];

  // Main game scenarios
  const scenarios = [
    {
      title: "Lunch Table Conflict 🍽️",
      description: "You notice a classmate sitting alone because your friends excluded them from your lunch table.",
      principle: "Help and uplift others - no bullying ever",
      options: [
        {
          text: "Walk over and invite them to sit with us at our table",
          score: 20, // Best choice
          feedback: "Excellent! This shows leadership and kindness.",
          consequences: [
            '✅ They feel included and welcomed',
            '✅ Shows leadership and sets a good example',
            '✅ Builds a more inclusive community',
            '✅ You feel good about helping someone'
          ]
        },
        {
          text: "Tell a teacher about the situation privately",
          score: 10, // Good choice
          feedback: "Good thinking! Getting adult help is responsible.",
          consequences: [
            '✅ Gets adult support for the situation',
            '✅ Shows you care about fairness',
            '⚠️ Might take longer to solve the problem',
            '⚠️ Student might feel embarrassed'
          ]
        },
        {
          text: "Feel bad but don't do anything because it might be awkward",
          score: 5, // Poor choice
          feedback: "It's natural to feel uncertain, but consider taking action.",
          consequences: [
            '⚠️ You avoid potential awkwardness',
            '❌ The student continues to feel left out',
            '❌ Missed opportunity to help',
            '❌ You might feel guilty later'
          ]
        },
        {
          text: "Ignore it completely and focus on my own lunch",
          score: 0, // Worst choice
          feedback: "Let's think about how we can help others in need.",
          consequences: [
            '❌ Shows lack of empathy for others',
            '❌ Goes against school values of inclusion',
            '❌ The student feels more isolated',
            '❌ Missed chance to be a positive leader'
          ]
        }
      ]
    },
    {
      title: "Group Project Mistake 📚",
      description: "You made an error in research that affected your whole group's presentation.",
      principle: "Learn from our mistakes and move on",
      options: [
        {
          text: "Tell the teacher immediately and offer to redo my part correctly",
          score: 20, // Best choice
          feedback: "Excellent! Taking responsibility shows integrity.",
          consequences: [
            '✅ Shows honesty and responsibility',
            '✅ Teacher can help find a solution',
            '✅ Group gets accurate information',
            '✅ You learn from your mistake'
          ]
        },
        {
          text: "Talk to my group first and work together to fix the problem",
          score: 10, // Good choice
          feedback: "Good teamwork! Collaboration is important.",
          consequences: [
            '✅ Shows respect for your teammates',
            '✅ Group works together to solve it',
            '⚠️ Might take longer to fix',
            '⚠️ Could still affect grades if not caught in time'
          ]
        },
        {
          text: "Hope no one notices and just move on quietly",
          score: 5, // Poor choice
          feedback: "Avoiding the problem won't help your learning or your team.",
          consequences: [
            '⚠️ Avoids immediate embarrassment',
            '❌ Group might get wrong information',
            '❌ Doesn\'t take responsibility',
            '❌ Misses chance to learn from mistake'
          ]
        },
        {
          text: "Blame the sources I used and say it wasn't my fault",
          score: 0, // Worst choice
          feedback: "Taking responsibility helps us grow stronger.",
          consequences: [
            '❌ Doesn\'t take ownership of mistakes',
            '❌ Group loses trust in you',
            '❌ Misses learning opportunity',
            '❌ Goes against school values of honesty'
          ]
        }
      ]
    },
    {
      title: "Club Choice Dilemma 🏕️",
      description: "You want to join Mr. Castle's Outdoor Club where students go on field trips in nature, but your friends are pressuring you to join sports instead.",
      principle: "Proudly share our ideas and thoughts",
      options: [
        {
          text: "Join the Outdoor Club because it's what I'm truly passionate about",
          score: 20, // Best choice
          feedback: "Excellent! Following your authentic interests shows courage.",
          consequences: [
            '✅ You pursue your genuine interests',
            '✅ Shows authenticity and self-respect',
            '✅ You\'ll enjoy activities you love',
            '✅ Demonstrates independent thinking'
          ]
        },
        {
          text: "Talk to my friends about why the Outdoor Club excites me",
          score: 10, // Good choice
          feedback: "Good communication! Sharing your perspective is important.",
          consequences: [
            '✅ Friends understand your interests better',
            '✅ You practice expressing your thoughts',
            '✅ Might inspire friends to try new things',
            '⚠️ Friends might still pressure you'
          ]
        },
        {
          text: "Join sports to keep my friends happy, even though I'm not interested",
          score: 5, // Poor choice
          feedback: "Consider what happens when we ignore our own interests.",
          consequences: [
            '⚠️ Friends are temporarily happy',
            '❌ You sacrifice your genuine interests',
            '❌ Might not perform well in something you dislike',
            '❌ Misses chance to explore your passion'
          ]
        },
        {
          text: "Avoid making any choice and don't join anything",
          score: 0, // Worst choice
          feedback: "Avoiding choices means missing opportunities to grow.",
          consequences: [
            '❌ Miss out on both opportunities',
            '❌ Friends might be disappointed anyway',
            '❌ No chance to pursue interests',
            '❌ Avoids growth and new experiences'
          ]
        }
      ]
    }
  ];

  // Lightning round questions (5-step model)
  const lightningQuestions = [
    {
      question: "Which verb means 'to stop and think before reacting'?",
      options: ["pause", "choose", "reflect", "consider"],
      correct: "pause"
    },
    {
      question: "Which verb means 'to think about what choices I have'?",
      options: ["reflect", "consider", "choose", "pause"],
      correct: "consider"
    },
    {
      question: "When you ask 'Which choice helps others most?' you are learning to _____ your options.",
      options: ["choose", "pause", "evaluate", "reflect"],
      correct: "evaluate"
    },
    {
      question: "Which verb means 'to make your decision and commit to it'?",
      options: ["evaluate", "consider", "choose", "pause"],
      correct: "choose"
    },
    {
      question: "Which verb means 'to think about what happened and what you learned'?",
      options: ["pause", "choose", "reflect", "evaluate"],
      correct: "reflect"
    }
  ];

  const [currentLightningQuestion, setCurrentLightningQuestion] = useState(0);
  const [lightningScore, setLightningScore] = useState(0);

  // Final assessment scenario
  const assessmentScenario = {
    title: "Classroom Disruption 🏫",
    description: "During quiet study time in the library, some classmates are being loud and disruptive. Other students are getting distracted and the librarian looks frustrated. You want to help create a respectful learning environment.",
    principle: "Respect the space that we are in",
    prompt: "Write out your complete 5-step decision-making process (pause, consider, evaluate, choose, reflect). Describe each step you would take to handle this situation."
  };

  // Audio pronunciation function
  const playAudio = (verb) => {
    // In a real implementation, this would play actual audio
    alert(`Pronunciation: ${processVerbs[verb].audio}`);
  };

  // Interactive Functions

  // STEP 1: Pause Interactive Functions
  const startBreathing = () => {
    setBreathingActive(true);
    setBreathingCount(5);
    const breatheInterval = setInterval(() => {
      setBreathingCount((prev) => {
        if (prev <= 1) {
          clearInterval(breatheInterval);
          setBreathingActive(false);
          checkPauseComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleStopSignClick = () => {
    setStopSignClicked(true);
    checkPauseComplete();
  };

  const adjustImpulseLevel = (direction) => {
    setImpulseLevel((prev) => {
      const newLevel = direction === 'down' ? Math.max(1, prev - 1) : Math.min(10, prev + 1);
      if (newLevel <= 3) {
        checkPauseComplete();
      }
      return newLevel;
    });
  };

  const checkPauseComplete = () => {
    setTimeout(() => {
      if (!breathingActive && breathingCount === 0 && stopSignClicked && impulseLevel <= 3) {
        setPauseComplete(true);
      }
    }, 500);
  };

  // STEP 3: Evaluate Interactive Functions
  const updateScalePosition = (key, value) => {
    setScalePositions({ ...scalePositions, [key]: value });
  };

  // STEP 4: Choose Interactive Functions
  const handleFinalChoice = (choice) => {
    setFinalChoice(choice);
  };

  // STEP 5: Reflect Interactive Functions
  const handleReflection = (text) => {
    setReflectionText(text);
    const wordCount = text.trim().split(/\s+/).length;
    const points = Math.min(20, Math.floor(wordCount / 10) * 5);
    setGrowthPoints(points);
  };

  // Reset functions for new scenarios
  const resetInteractiveStates = () => {
    setPauseComplete(false);
    setBreathingActive(false);
    setBreathingCount(5);
    setImpulseLevel(8);
    setStopSignClicked(false);
    setSelectedOptionForWhatIf('');
    setScalePositions({});
    setConfidenceLevel(5);
    setFinalChoice('');
    setReflectionText('');
    setGrowthPoints(0);
  };

  // Interactive Component Renderers

  // STEP 1: Pause Components
  const renderPauseInteractives = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-[#211f60] mb-2">⏸️ PAUSE</h3>
        <p className="text-lg text-[#211f60] font-medium">Complete all three activities to master pausing:</p>
      </div>

      {/* Breathing Timer */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <h4 className="font-bold text-blue-800 mb-4 flex items-center">
          <span className="mr-2">🫁</span> Breathing Exercise
        </h4>
        <p className="text-blue-700 mb-4">Take 5 deep breaths to calm your mind:</p>
        <div className="text-center">
          {breathingActive ? (
            <div className="relative">
              <div className="w-32 h-32 mx-auto bg-blue-200 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-3xl font-bold text-blue-800">{breathingCount}</span>
              </div>
              <p className="text-blue-700 mt-2 font-medium">Breathe slowly...</p>
            </div>
          ) : breathingCount === 0 ? (
            <div className="flex items-center justify-center space-x-2 text-green-700">
              <CheckCircle size={24} />
              <span className="font-bold">Breathing Complete!</span>
            </div>
          ) : (
            <button
              onClick={startBreathing}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold"
            >
              Start Breathing Exercise
            </button>
          )}
        </div>
      </div>

      {/* Stop Sign */}
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
        <h4 className="font-bold text-red-800 mb-4 flex items-center">
          <span className="mr-2">🛑</span> Stop Sign
        </h4>
        <p className="text-red-700 mb-4">Click the stop sign to practice stopping before reacting:</p>
        <div className="text-center">
          {stopSignClicked ? (
            <div className="flex items-center justify-center space-x-2 text-green-700">
              <CheckCircle size={24} />
              <span className="font-bold">Good job stopping!</span>
            </div>
          ) : (
            <button
              onClick={handleStopSignClick}
              className="w-24 h-24 bg-red-600 text-white rounded-full flex items-center justify-center text-4xl hover:bg-red-700 transform hover:scale-105 transition-all mx-auto"
            >
              🛑
            </button>
          )}
        </div>
      </div>

      {/* Impulse Meter */}
      <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
        <h4 className="font-bold text-orange-800 mb-4 flex items-center">
          <span className="mr-2">📊</span> Calm Down Meter
        </h4>
        <p className="text-orange-700 mb-4">Bring your stress level down to 3 or below:</p>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-bold text-orange-800">Stress Level: {impulseLevel}/10</span>
            <div className="flex space-x-2">
              <button
                onClick={() => adjustImpulseLevel('down')}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-bold"
              >
                Calm Down ↓
              </button>
              <button
                onClick={() => adjustImpulseLevel('up')}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-bold"
              >
                Stress Up ↑
              </button>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all duration-300 ${
                impulseLevel <= 3 ? 'bg-green-500' : impulseLevel <= 6 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${impulseLevel * 10}%` }}
            />
          </div>
          {impulseLevel <= 3 && (
            <div className="flex items-center justify-center space-x-2 text-green-700">
              <CheckCircle size={20} />
              <span className="font-bold">Great! You're calm enough to think clearly!</span>
            </div>
          )}
        </div>
      </div>

      {pauseComplete && (
        <div className="bg-green-100 border-2 border-green-400 rounded-xl p-6 text-center">
          <h4 className="text-2xl font-bold text-green-800 mb-2">🎉 Pause Step Complete!</h4>
          <p className="text-green-700 font-medium">You've learned to pause and think before reacting!</p>
          <button
            onClick={() => {
              setCurrentStep(currentStep + 1);
              resetInteractiveStates();
              setScore(score + 25);
            }}
            className="mt-4 bg-[#211f60] text-white px-6 py-3 rounded-lg hover:bg-[#211f60]/90 font-bold"
          >
            Continue to Consider Step ✨ (+25 points)
          </button>
        </div>
      )}
    </div>
  );

  // STEP 2: Consider Components
  const renderConsiderInteractives = () => {
    const scenario = scenarios[currentScenario];
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-[#211f60] mb-2">🤔 CONSIDER</h3>
          <p className="text-lg text-[#211f60] font-medium">Review your options and explore what might happen:</p>
        </div>

        {/* Pre-defined Options */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h4 className="font-bold text-blue-800 mb-4 flex items-center">
            <span className="mr-2">📋</span>
            Your Options
          </h4>
          <p className="text-blue-700 mb-4">Here are the choices you could make in this situation:</p>
          
          <div className="space-y-3">
            {scenario.options.map((option, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border-2 border-blue-200 hover:border-blue-400 transition-all">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-blue-800 text-lg">{option.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What If Explorer */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
          <h4 className="font-bold text-purple-800 mb-4 flex items-center">
            <Eye className="mr-2" size={20} />
            What If Explorer
          </h4>
          <p className="text-purple-700 mb-4">Click an option to see what might happen:</p>
          
          <div className="grid grid-cols-1 gap-3 mb-4">
            {scenario.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOptionForWhatIf(index)}
                className={`p-4 rounded-lg border-2 transition-all font-medium text-left ${
                  selectedOptionForWhatIf === index
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-purple-800 border-purple-300 hover:bg-purple-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="font-bold">Option {index + 1}:</span>
                  <span>{option.text}</span>
                </div>
              </button>
            ))}
          </div>

          {selectedOptionForWhatIf !== '' && (
            <div className="bg-white rounded-lg p-4 border-2 border-purple-300">
              <h5 className="font-bold text-purple-800 mb-3">
                What if: "{scenario.options[selectedOptionForWhatIf]?.text}"?
              </h5>
              <div className="space-y-2">
                {scenario.options[selectedOptionForWhatIf]?.consequences.map((result, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-purple-700 font-medium">{result}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-green-100 border-2 border-green-400 rounded-xl p-6 text-center">
          <h4 className="text-2xl font-bold text-green-800 mb-2">🎉 Consider Step Complete!</h4>
          <p className="text-green-700 font-medium">You've explored all the options!</p>
          <button
            onClick={() => {
              setCurrentStep(currentStep + 1);
              setScore(score + 25);
            }}
            className="mt-4 bg-[#211f60] text-white px-6 py-3 rounded-lg hover:bg-[#211f60]/90 font-bold"
          >
            Continue to Evaluate Step ✨ (+25 points)
          </button>
        </div>
      </div>
    );
  };

  // STEP 3: Evaluate Components
  const renderEvaluateInteractives = () => {
    const scenario = scenarios[currentScenario];
    const totalRatings = scenario.options.length; // Just 4 sliders now!
    const completedRatings = Object.keys(scalePositions).length;
    const isEvaluationComplete = completedRatings >= totalRatings;
    
    // Calculate ratings for feedback
    const getOptionRatings = () => {
      return scenario.options.map((option, optionIndex) => {
        const rating = scalePositions[optionIndex] || 5;
        return { optionIndex, rating, score: option.score };
      });
    };

    const getColorForOption = (optionIndex) => {
      if (!isEvaluationComplete) return 'border-yellow-300';
      
      const option = scenario.options[optionIndex];
      if (option.score >= 20) return 'border-green-500 bg-green-50'; // Best
      if (option.score >= 10) return 'border-yellow-500 bg-yellow-50'; // Good
      if (option.score >= 5) return 'border-orange-500 bg-orange-50'; // Poor
      return 'border-red-500 bg-red-50'; // Worst
    };
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-[#211f60] mb-2">⚖️ EVALUATE</h3>
          <p className="text-lg text-[#211f60] font-medium">Rate each option based on our Terronez 10 principle:</p>
        </div>

        {/* Principle Focus */}
        <div className="bg-[#ffd230]/20 border-2 border-[#ffd230] rounded-xl p-6">
          <h4 className="text-xl font-bold text-[#211f60] mb-2">🎯 Today's Focus</h4>
          <p className="text-lg font-bold text-[#211f60]">{scenario.principle}</p>
        </div>

        {/* Single Values Scale */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
          <h4 className="font-bold text-yellow-800 mb-4 flex items-center">
            <Scale className="mr-2" size={20} />
            Rate Each Option
          </h4>
          <p className="text-yellow-700 mb-6">
            How well does each option align with <strong>"{scenario.principle}"</strong>?
          </p>
          
          <div className="space-y-4">
            {scenario.options.map((option, optionIndex) => (
              <div 
                key={optionIndex} 
                className={`p-4 rounded-lg border-2 transition-all ${getColorForOption(optionIndex)}`}
              >
                <div className="mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {optionIndex + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{option.text}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 w-12">Poor</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={scalePositions[optionIndex] || 5}
                    onChange={(e) => updateScalePosition(optionIndex, parseInt(e.target.value))}
                    className="flex-1 accent-[#ffd230]"
                    disabled={isEvaluationComplete}
                  />
                  <span className="text-sm text-gray-600 w-12">Excellent</span>
                  <span className="font-bold text-gray-800 w-8 text-center bg-white px-2 py-1 rounded">
                    {scalePositions[optionIndex] || 5}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {isEvaluationComplete && (
            <div className="mt-6 bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-400 rounded-xl p-6">
              <h5 className="font-bold text-green-800 mb-4 text-xl flex items-center">
                <span className="mr-2">🎯</span>
                Evaluation Results - See How Your Ratings Compare!
              </h5>
              <div className="grid grid-cols-1 gap-3">
                {scenario.options.map((option, index) => {
                  const ratings = getOptionRatings();
                  const optionRating = ratings.find(r => r.optionIndex === index);
                  
                  let colorClass, icon, message;
                  if (option.score >= 20) {
                    colorClass = 'bg-green-500 text-white border-green-600';
                    icon = '🌟';
                    message = 'Excellent Choice!';
                  } else if (option.score >= 10) {
                    colorClass = 'bg-yellow-500 text-white border-yellow-600';
                    icon = '👍';
                    message = 'Good Option';
                  } else if (option.score >= 5) {
                    colorClass = 'bg-orange-500 text-white border-orange-600';
                    icon = '⚠️';
                    message = 'Consider Carefully';
                  } else {
                    colorClass = 'bg-red-500 text-white border-red-600';
                    icon = '🤔';
                    message = 'Think Again';
                  }
                  
                  return (
                    <div key={index} className={`p-4 rounded-lg border-2 ${colorClass} transform transition-all duration-300`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{icon}</span>
                          <div>
                            <p className="font-bold">{message}</p>
                            <p className="text-sm opacity-90">Option {index + 1}: {option.text.substring(0, 60)}...</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">Your Rating: {optionRating?.rating}/10</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {isEvaluationComplete && (
          <div className="bg-green-100 border-2 border-green-400 rounded-xl p-6 text-center">
            <h4 className="text-2xl font-bold text-green-800 mb-2">🎉 Evaluate Step Complete!</h4>
            <p className="text-green-700 font-medium">Great work! Now you can see which choices align best with our school principle!</p>
            <button
              onClick={() => {
                // Bonus points for identifying the best option correctly
                const ratings = getOptionRatings();
                const bestOptionIndex = scenario.options.findIndex(opt => opt.score === 20);
                const studentHighestRated = ratings.reduce((prev, curr) => 
                  curr.rating > prev.rating ? curr : prev
                );
                
                let bonus = 30;
                if (studentHighestRated.optionIndex === bestOptionIndex) {
                  bonus += 10; // Bonus for correctly identifying best option
                }
                
                setCurrentStep(currentStep + 1);
                setScore(score + bonus);
              }}
              className="mt-4 bg-[#211f60] text-white px-6 py-3 rounded-lg hover:bg-[#211f60]/90 font-bold"
            >
              Continue to Choose Step ✨ (+30+ points)
            </button>
          </div>
        )}
      </div>
    );
  };

  // STEP 4: Choose Components
  const renderChooseInteractives = () => {
    const scenario = scenarios[currentScenario];
    
    const handleFinalChoiceWithFeedback = (optionIndex) => {
      setFinalChoice(optionIndex);
      
      // Show immediate feedback based on choice quality
      const option = scenario.options[optionIndex];
      let feedbackMessage = "";
      
      if (option.score >= 20) {
        feedbackMessage = "🌟 Excellent choice! This shows great character and leadership!";
      } else if (option.score >= 10) {
        feedbackMessage = "👍 Good thinking! This is a solid, responsible choice.";
      } else if (option.score >= 5) {
        feedbackMessage = "⚠️ Consider the consequences - how might this affect everyone involved?";
      } else {
        feedbackMessage = "🤔 Think about our school values - is there a more helpful approach?";
      }
      
      // Set feedback for display
      setFeedbackState({
        message: feedbackMessage,
        score: option.score,
        isCorrect: option.score >= 10
      });
    };

    const getChoiceColor = (optionIndex) => {
      if (finalChoice !== optionIndex) {
        return 'bg-white text-green-800 border-green-300 hover:bg-green-100';
      }
      
      const option = scenario.options[optionIndex];
      if (option.score >= 20) {
        return 'bg-green-600 text-white border-green-600 shadow-lg animate-pulse';
      } else if (option.score >= 10) {
        return 'bg-yellow-500 text-white border-yellow-500 shadow-lg';
      } else if (option.score >= 5) {
        return 'bg-orange-500 text-white border-orange-500 shadow-lg';
      } else {
        return 'bg-red-500 text-white border-red-500 shadow-lg';
      }
    };
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-[#211f60] mb-2">✅ CHOOSE</h3>
          <p className="text-lg text-[#211f60] font-medium">Make your decision and commit to it:</p>
        </div>

        {/* Final Choice Selection */}
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
          <h4 className="font-bold text-green-800 mb-4 flex items-center">
            <CheckCircle className="mr-2" size={20} />
            Make Your Final Choice
          </h4>
          <p className="text-green-700 mb-4">Based on your evaluation, which option will you choose?</p>
          
          <div className="space-y-3 mb-6">
            {scenario.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleFinalChoiceWithFeedback(index)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all font-medium transform hover:scale-[1.02] ${getChoiceColor(index)}`}
              >
                <div className="flex items-start space-x-3">
                  <span className="font-bold">Option {index + 1}:</span>
                  <span>{option.text}</span>
                </div>
              </button>
            ))}
          </div>

          {finalChoice !== '' && (
            <div className="space-y-4">
              {/* Immediate Feedback */}
              <div className={`rounded-lg p-4 border-2 ${
                scenario.options[finalChoice].score >= 20 ? 'bg-green-100 border-green-400' :
                scenario.options[finalChoice].score >= 10 ? 'bg-yellow-100 border-yellow-400' :
                scenario.options[finalChoice].score >= 5 ? 'bg-orange-100 border-orange-400' :
                'bg-red-100 border-red-400'
              }`}>
                <p className="font-bold text-lg mb-2">{feedbackState?.message}</p>
                <p className="font-medium">Choice: "{scenario.options[finalChoice].text}"</p>
                <p className="text-sm mt-2 opacity-80">{scenario.options[finalChoice].feedback}</p>
              </div>
            </div>
          )}
        </div>

        {/* Confidence Slider */}
        {finalChoice !== '' && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <h4 className="font-bold text-blue-800 mb-4 flex items-center">
              <Sliders className="mr-2" size={20} />
              Confidence Level
            </h4>
            <p className="text-blue-700 mb-4">How confident are you in this decision?</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-800">Confidence: {confidenceLevel}/10</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-blue-600">Not sure</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={confidenceLevel}
                    onChange={(e) => setConfidenceLevel(parseInt(e.target.value))}
                    className="w-48 accent-[#ffd230]"
                  />
                  <span className="text-sm text-blue-600">Very sure</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${confidenceLevel * 10}%` }}
                />
              </div>
              <p className="text-blue-700 text-center font-medium">
                {confidenceLevel >= 8 ? "Very confident!" : 
                 confidenceLevel >= 6 ? "Pretty confident" : 
                 confidenceLevel >= 4 ? "Somewhat confident" : "Not very confident"}
              </p>
            </div>
          </div>
        )}

        {finalChoice !== '' && confidenceLevel > 0 && (
          <div className="bg-green-100 border-2 border-green-400 rounded-xl p-6 text-center">
            <h4 className="text-2xl font-bold text-green-800 mb-2">🎉 Choose Step Complete!</h4>
            <p className="text-green-700 font-medium">You've made your decision with {confidenceLevel}/10 confidence!</p>
            <button
              onClick={() => {
                const choiceScore = scenario.options[finalChoice].score;
                const confidenceBonus = confidenceLevel * 2;
                const basePoints = 20;
                
                setCurrentStep(currentStep + 1);
                setScore(score + basePoints + choiceScore + confidenceBonus);
              }}
              className="mt-4 bg-[#211f60] text-white px-6 py-3 rounded-lg hover:bg-[#211f60]/90 font-bold"
            >
              Continue to Reflect Step ✨ (+{20 + scenario.options[finalChoice]?.score + confidenceLevel * 2} points)
            </button>
          </div>
        )}
      </div>
    );
  };

  // STEP 5: Reflect Components
  const renderReflectInteractives = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-[#211f60] mb-2">🪞 REFLECT</h3>
        <p className="text-lg text-[#211f60] font-medium">Think about your decision and what you learned:</p>
      </div>

      {/* Reflection Writing */}
      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
        <h4 className="font-bold text-purple-800 mb-4 flex items-center">
          <span className="mr-2">📝</span>
          Learning Reflection
        </h4>
        <p className="text-purple-700 mb-4">Write about your decision-making process:</p>
        
        <div className="space-y-4">
          <div>
            <label className="block font-medium text-purple-800 mb-2">
              Reflect on your experience (the more you write, the more points you earn):
            </label>
            <textarea
              value={reflectionText}
              onChange={(e) => handleReflection(e.target.value)}
              placeholder="What did you learn? How did the 5-step process help you? What might you do differently next time? How does this connect to our school values?"
              className="w-full h-32 px-4 py-3 border-2 border-purple-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          <div className="flex justify-between items-center text-sm text-purple-600">
            <span>Words: {reflectionText.trim() ? reflectionText.trim().split(/\s+/).length : 0}</span>
            <span>Reflection Points: +{growthPoints}</span>
          </div>
        </div>
      </div>

      {/* Growth Tracker */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
        <h4 className="font-bold text-yellow-800 mb-4 flex items-center">
          <TrendingUp className="mr-2" size={20} />
          Decision-Making Growth
        </h4>
        <p className="text-yellow-700 mb-4">Track your progress in the 5-step process:</p>
        
        <div className="space-y-3">
          {['Pause', 'Consider', 'Evaluate', 'Choose', 'Reflect'].map((step, index) => (
            <div key={step} className="flex items-center justify-between bg-white p-3 rounded-lg border">
              <span className="font-medium text-yellow-800">✅ {step}</span>
              <span className="text-yellow-600 text-sm font-medium">Mastered!</span>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-white rounded-lg p-4 border-2 border-yellow-300 text-center">
          <h5 className="font-bold text-yellow-800 mb-2">🌟 Scenario Complete!</h5>
          <p className="text-yellow-700">You've successfully used the 5-step decision-making process!</p>
        </div>
      </div>

      {reflectionText.trim().length > 20 && (
        <div className="bg-green-100 border-2 border-green-400 rounded-xl p-6 text-center">
          <h4 className="text-2xl font-bold text-green-800 mb-2">🎉 Reflect Step Complete!</h4>
          <p className="text-green-700 font-medium">You've thoughtfully reflected on your learning!</p>
          <button
            onClick={() => {
              const totalPoints = 25 + growthPoints;
              setScore(score + totalPoints);
              
              // Move to next scenario or complete game
              if (currentScenario < scenarios.length - 1) {
                setCurrentScenario(currentScenario + 1);
                setCurrentStep(0);
                resetInteractiveStates();
              } else {
                setGamePhase('lightning');
                setTimeLeft(180);
                setCurrentLightningQuestion(0);
                setLightningScore(0);
              }
            }}
            className="mt-4 bg-[#211f60] text-white px-6 py-3 rounded-lg hover:bg-[#211f60]/90 font-bold"
          >
            {currentScenario < scenarios.length - 1 
              ? `Continue to Next Scenario ✨ (+${25 + growthPoints} points)`
              : `Complete All Scenarios ✨ (+${25 + growthPoints} points)`
            }
          </button>
        </div>
      )}
    </div>
  );

  // Timer effect for warmup
  useEffect(() => {
    if (gamePhase === 'warmup' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gamePhase === 'warmup' && timeLeft === 0) {
      setGamePhase('main');
      setCurrentStep(0);
      setCurrentScenario(0);
    }
  }, [timeLeft, gamePhase]);

  // Timer effect for lightning round
  useEffect(() => {
    if (gamePhase === 'lightning' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gamePhase === 'lightning' && timeLeft === 0) {
      setGamePhase('assessment');
    }
  }, [timeLeft, gamePhase]);

  // Handle warmup answer
  const handleWarmupAnswer = (answer) => {
    const question = warmupQuestions[currentStep];
    const isCorrect = answer === question.correct;
    
    if (isCorrect) {
      setScore(score + question.points);
    }
    
    // Show feedback
    setFeedbackState({
      isCorrect,
      selectedAnswer: answer,
      correctAnswer: question.correct,
      points: isCorrect ? question.points : 0
    });
    setShowingFeedback(true);
    
    // Move to next question after delay
    setTimeout(() => {
      setShowingFeedback(false);
      setFeedbackState(null);
      
      if (currentStep < warmupQuestions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setGamePhase('main');
        setCurrentStep(0);
        setCurrentScenario(0);
      }
    }, 1500);
  };

  // Handle main game answer selection
  const handleAnswerSelect = (answer, scenarioIndex, stepIndex) => {
    if (showingFeedback || isTransitioning) return;
    
    const scenario = scenarios[scenarioIndex];
    const step = scenario.steps[stepIndex];
    
    // Calculate points based on correctness
    const isCorrect = step.correctAnswers.includes(answer);
    let points = 0;
    if (isCorrect) {
      points = step.correctAnswers[0] === answer ? 15 : 10;
      setScore(score + points);
    }
    
    // Set feedback state
    setFeedbackState({
      isCorrect,
      points,
      message: step.feedback[answer],
      selectedAnswer: answer
    });
    setShowingFeedback(true);
    
    // Add to selected answers history
    setSelectedAnswers([...selectedAnswers, { answer, points, feedback: step.feedback[answer] }]);
    
    // Transition to next step/scenario after delay
    setTimeout(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setShowingFeedback(false);
        setFeedbackState(null);
        setIsTransitioning(false);
        
        if (stepIndex < scenario.steps.length - 1) {
          setCurrentStep(stepIndex + 1);
        } else if (scenarioIndex < scenarios.length - 1) {
          setCurrentScenario(scenarioIndex + 1);
          setCurrentStep(0);
        } else {
          setGamePhase('lightning');
          setTimeLeft(180); // 3 minutes for lightning round
          setCurrentLightningQuestion(0);
          setLightningScore(0);
        }
      }, 300);
    }, 2000);
  };

  // Handle lightning round answer
  const handleLightningAnswer = (answer) => {
    const question = lightningQuestions[currentLightningQuestion];
    const isCorrect = answer === question.correct;
    
    if (isCorrect) {
      setLightningScore(lightningScore + 5);
      setScore(score + 5);
    }
    
    // Show quick feedback
    setFeedbackState({
      isCorrect,
      selectedAnswer: answer,
      correctAnswer: question.correct
    });
    setShowingFeedback(true);
    
    setTimeout(() => {
      setShowingFeedback(false);
      setFeedbackState(null);
      
      if (currentLightningQuestion < lightningQuestions.length - 1) {
        setCurrentLightningQuestion(currentLightningQuestion + 1);
      } else {
        setGamePhase('assessment');
      }
    }, 1000);
  };

  // Render current game phase
  const renderGamePhase = () => {
    switch (gamePhase) {
      case 'welcome':
        return (
          <div className="text-center space-y-8">
            {/* School Header */}
            <div className="bg-[#211f60] text-white py-6 px-8 rounded-xl shadow-lg">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <GraduationCap size={40} className="text-[#ffd230]" />
                <div>
                  <h1 className="text-3xl font-bold text-[#ffd230]">TERRONEZ 10</h1>
                  <p className="text-xl font-semibold">Decision Navigator</p>
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-lg">Master the language of decision-making using our guiding principles!</p>
              </div>
            </div>

            {/* Learning Goals */}
            <div className="bg-[#ffd230]/20 border-2 border-[#ffd230] rounded-xl p-6 max-w-2xl mx-auto">
              <h3 className="font-bold text-[#211f60] text-xl mb-3">🎯 Learning Goals</h3>
              <p className="text-[#211f60] font-medium text-lg">
                Master the 5-step decision process: Pause → Consider → Evaluate → Choose → Reflect
              </p>
            </div>

            {/* Student Input */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter your name to start"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="px-6 py-3 border-2 border-[#211f60] rounded-xl text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#ffd230] focus:border-[#ffd230]"
              />
              <button
                onClick={() => setGamePhase('warmup')}
                disabled={!studentName.trim()}
                className="bg-[#211f60] text-white px-8 py-4 rounded-xl text-xl font-bold hover:bg-[#211f60]/90 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Start Your Journey! 🚀
              </button>
            </div>
          </div>
        );

      case 'warmup':
        const warmupQuestion = warmupQuestions[currentStep];
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-[#211f60] text-white rounded-xl p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center">
                  <span className="text-[#ffd230] mr-3">🏃‍♂️</span>
                  Warm-up Round
                </h2>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                    <Clock className="text-[#ffd230]" size={20} />
                    <span className="font-bold text-[#ffd230]">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                    <Award className="text-[#ffd230]" size={20} />
                    <span className="font-bold text-[#ffd230]">{score} points</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vocabulary reference */}
            <div className="bg-[#ffd230]/10 border-2 border-[#ffd230] rounded-xl p-6">
              <button 
                onClick={() => setShowDefinitions(!showDefinitions)}
                className="flex items-center space-x-3 text-[#211f60] hover:text-[#211f60]/80 font-bold text-lg w-full justify-center"
              >
                <BookOpen size={24} />
                <span>Process Vocabulary Helper</span>
                <HelpCircle size={20} />
              </button>
              
              {showDefinitions && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(processVerbs).map(([verb, info]) => (
                    <div key={verb} className="bg-white border-2 border-[#211f60]/20 p-4 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-3xl">{info.emoji}</span>
                        <span className="font-bold capitalize text-[#211f60] text-lg">{verb}</span>
                        <button onClick={() => playAudio(verb)} className="text-[#ffd230] hover:text-[#ffd230]/80">
                          <Volume2 size={18} />
                        </button>
                      </div>
                      <p className="text-[#211f60]/80 font-medium">{info.definition}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Warmup questions */}
            <div className="bg-white border-2 border-[#211f60]/20 rounded-xl p-8 shadow-lg">
              <div className="mb-6">
                <span className="text-sm font-bold text-[#211f60]/60 uppercase tracking-wide">
                  Question {currentStep + 1} of {warmupQuestions.length}
                </span>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                  <div 
                    className="bg-[#ffd230] h-3 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / warmupQuestions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#211f60] mb-6">Choose the best process verb:</h3>
              <p className="text-xl text-[#211f60] mb-8 font-medium">{warmupQuestion?.question}</p>
              <div className="space-y-3">
                {warmupQuestion?.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleWarmupAnswer(option)}
                    disabled={showingFeedback}
                    className={`w-full text-left px-6 py-4 border-2 rounded-xl transition-all font-bold text-lg transform hover:scale-[1.02] ${
                      showingFeedback && feedbackState?.selectedAnswer === option
                        ? feedbackState.isCorrect
                          ? 'bg-green-100 border-green-400 text-green-800 shadow-lg'
                          : 'bg-red-100 border-red-400 text-red-800 shadow-lg'
                        : showingFeedback && option === warmupQuestion.correct && !feedbackState?.isCorrect
                          ? 'bg-green-50 border-green-300 text-green-700'
                          : 'border-[#211f60]/20 hover:bg-[#ffd230]/10 hover:border-[#ffd230] text-[#211f60] shadow-sm'
                    } ${showingFeedback ? 'cursor-not-allowed' : ''}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'main':
        const scenario = scenarios[currentScenario];
        
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-[#211f60] text-white rounded-xl p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center">
                  <span className="text-[#ffd230] mr-3">⭐</span>
                  Interactive Challenge
                </h2>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                    <Target className="text-[#ffd230]" size={20} />
                    <span className="font-bold text-[#ffd230]">Scenario {currentScenario + 1} of {scenarios.length}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                    <Award className="text-[#ffd230]" size={20} />
                    <span className="font-bold text-[#ffd230]">{score} points</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scenario introduction */}
            <div className="bg-[#ffd230]/20 border-2 border-[#ffd230] rounded-xl p-8">
              <h3 className="text-2xl font-bold text-[#211f60] mb-4">{scenario.title}</h3>
              <p className="text-[#211f60] mb-6 text-lg font-medium">{scenario.description}</p>
              <div className="bg-white border-2 border-[#211f60] rounded-lg p-4">
                <p className="text-sm font-bold text-[#211f60] uppercase tracking-wide mb-1">Terronez 10 Principle:</p>
                <p className="font-bold text-[#211f60] text-lg">{scenario.principle}</p>
              </div>
            </div>

            {/* 5-Step Progress Indicator */}
            <div className="bg-white border-2 border-[#211f60]/20 rounded-xl p-6">
              <h4 className="text-lg font-bold text-[#211f60] mb-4">5-Step Decision Process:</h4>
              <div className="flex items-center justify-between">
                {['Pause', 'Consider', 'Evaluate', 'Choose', 'Reflect'].map((stepName, index) => (
                  <div key={stepName} className={`flex items-center ${index < 4 ? 'flex-1' : ''}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 font-bold text-sm ${
                      currentStep > index 
                        ? 'bg-green-500 text-white border-green-500' 
                        : currentStep === index 
                          ? 'bg-[#ffd230] text-[#211f60] border-[#ffd230] animate-pulse' 
                          : 'bg-gray-100 text-gray-400 border-gray-300'
                    }`}>
                      {currentStep > index ? '✓' : index + 1}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      currentStep >= index ? 'text-[#211f60]' : 'text-gray-400'
                    }`}>
                      {stepName}
                    </span>
                    {index < 4 && (
                      <div className={`flex-1 h-1 mx-4 rounded ${
                        currentStep > index ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Step Content */}
            <div className="bg-white border-2 border-[#211f60]/20 rounded-xl p-8 shadow-lg">
              {currentStep === 0 && renderPauseInteractives()}
              {currentStep === 1 && renderConsiderInteractives()}
              {currentStep === 2 && renderEvaluateInteractives()}
              {currentStep === 3 && renderChooseInteractives()}
              {currentStep === 4 && renderReflectInteractives()}
            </div>

            {/* Vocabulary helper */}
            {showDefinitions && (
              <div className="bg-[#ffd230]/10 border-2 border-[#ffd230] rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(processVerbs).map(([verb, info]) => (
                    <div key={verb} className="bg-white border-2 border-[#211f60]/20 p-4 rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">{info.emoji}</span>
                        <span className="font-bold capitalize text-[#211f60]">{verb}</span>
                      </div>
                      <p className="text-[#211f60]/80 font-medium">{info.definition}</p>
                      {verb === 'evaluate' && info.scaffoldPrompts && (
                        <div className="mt-2">
                          <p className="text-xs font-bold text-[#211f60] mb-1">Ask yourself:</p>
                          <ul className="text-xs text-[#211f60]/70 space-y-1">
                            {info.scaffoldPrompts.map((prompt, index) => (
                              <li key={index}>• {prompt}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'lightning':
        const lightningQuestion = lightningQuestions[currentLightningQuestion];
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-[#211f60] text-white rounded-xl p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center">
                  <span className="text-[#ffd230] mr-3">⚡</span>
                  Lightning Round
                </h2>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                    <Clock className="text-[#ffd230]" size={20} />
                    <span className="font-bold text-[#ffd230]">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                    <Award className="text-[#ffd230]" size={20} />
                    <span className="font-bold text-[#ffd230]">{score} points</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#ffd230]/20 border-2 border-[#ffd230] rounded-xl p-8">
              <div className="mb-6">
                <span className="text-sm font-bold text-[#211f60]/60 uppercase tracking-wide">
                  Question {currentLightningQuestion + 1} of {lightningQuestions.length}
                </span>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                  <div 
                    className="bg-[#211f60] h-3 rounded-full transition-all duration-300"
                    style={{ width: `${((currentLightningQuestion + 1) / lightningQuestions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-xl text-[#211f60] mb-8 font-bold">{lightningQuestion?.question}</p>
              <div className="grid grid-cols-2 gap-4">
                {lightningQuestion?.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleLightningAnswer(option)}
                    disabled={showingFeedback}
                    className={`px-6 py-4 border-2 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] ${
                      showingFeedback && feedbackState?.selectedAnswer === option
                        ? feedbackState.isCorrect
                          ? 'bg-green-100 border-green-400 text-green-800 shadow-lg'
                          : 'bg-red-100 border-red-400 text-red-800 shadow-lg'
                        : showingFeedback && option === lightningQuestion.correct && !feedbackState?.isCorrect
                          ? 'bg-green-50 border-green-300 text-green-700'
                          : 'bg-white border-[#211f60]/20 hover:bg-[#ffd230]/20 hover:border-[#211f60] text-[#211f60] shadow-sm'
                    } ${showingFeedback ? 'cursor-not-allowed' : ''}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {showingFeedback && (
                <div className="mt-6 text-center">
                  <p className={`font-bold text-xl ${feedbackState?.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {feedbackState?.isCorrect ? '✅ Correct! +5 points' : '❌ Try again next time!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 'assessment':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-[#211f60] text-white rounded-xl p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center">
                  <span className="text-[#ffd230] mr-3">📝</span>
                  Final Assessment
                </h2>
                <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                  <Award className="text-[#ffd230]" size={20} />
                  <span className="font-bold text-[#ffd230]">Total: {score} points</span>
                </div>
              </div>
            </div>

            <div className="bg-[#ffd230]/20 border-2 border-[#ffd230] rounded-xl p-8">
              <h3 className="text-2xl font-bold text-[#211f60] mb-4">{assessmentScenario.title}</h3>
              <p className="text-[#211f60] mb-6 text-lg font-medium">{assessmentScenario.description}</p>
              <div className="bg-white border-2 border-[#211f60] rounded-lg p-4 mb-6">
                <p className="text-sm font-bold text-[#211f60] uppercase tracking-wide mb-1">Terronez 10 Principle:</p>
                <p className="font-bold text-[#211f60] text-lg">{assessmentScenario.principle}</p>
              </div>
              <p className="text-[#211f60] font-bold text-lg">{assessmentScenario.prompt}</p>
            </div>

            <div className="bg-white border-2 border-[#211f60]/20 rounded-xl p-8 shadow-lg">
              <label className="block text-xl font-bold text-[#211f60] mb-4">
                Your Response (use all 5 steps: pause, consider, evaluate, choose, reflect):
              </label>
              <textarea
                value={finalWriting}
                onChange={(e) => setFinalWriting(e.target.value)}
                placeholder="Write your decision-making process step by step using the process verbs..."
                className="w-full h-48 px-6 py-4 border-2 border-[#211f60]/20 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#ffd230] focus:border-[#ffd230] text-lg font-medium text-[#211f60]"
              />
              <div className="mt-6 flex justify-between items-center">
                <p className="text-sm text-[#211f60]/60 font-medium">
                  📸 Remember to take a screenshot of this response to submit to your teacher!
                </p>
                <button
                  onClick={() => setGamePhase('complete')}
                  disabled={finalWriting.trim().length < 50}
                  className="bg-[#211f60] text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-[#211f60]/90 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Complete Assessment
                </button>
              </div>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-8">
            {/* School Header */}
            <div className="bg-[#211f60] text-white py-8 px-8 rounded-xl shadow-lg">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <GraduationCap size={50} className="text-[#ffd230]" />
                <div>
                  <h1 className="text-4xl font-bold text-[#ffd230]">🎉 Congratulations!</h1>
                  <p className="text-2xl font-semibold">{studentName}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#ffd230]/20 border-2 border-[#ffd230] rounded-xl p-8 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-[#211f60] mb-6">Game Complete!</h2>
              <div className="text-xl text-[#211f60] space-y-3 font-bold">
                <p><span className="text-[#ffd230] bg-[#211f60] px-3 py-1 rounded-lg">Final Score:</span> {score} points</p>
                <p><span className="text-[#ffd230] bg-[#211f60] px-3 py-1 rounded-lg">Scenarios Completed:</span> {scenarios.length}</p>
                <p><span className="text-[#ffd230] bg-[#211f60] px-3 py-1 rounded-lg">Assessment:</span> Ready for teacher review</p>
              </div>
            </div>
            
            <div className="bg-white border-2 border-[#211f60]/20 rounded-xl p-6 max-w-xl mx-auto shadow-lg">
              <h3 className="font-bold text-[#211f60] mb-3 text-lg">📸 Don't Forget!</h3>
              <p className="text-[#211f60] font-medium">Take a screenshot of your final assessment response and submit it to your teacher.</p>
            </div>
            
            <button
              onClick={() => {
                setGamePhase('welcome');
                setScore(0);
                setCurrentScenario(0);
                setCurrentStep(0);
                setFinalWriting('');
                setSelectedAnswers([]);
                setFeedbackState(null);
                setShowingFeedback(false);
                setIsTransitioning(false);
                setStudentName('');
                setTimeLeft(300);
                setCurrentLightningQuestion(0);
                setLightningScore(0);
                resetInteractiveStates();
              }}
              className="bg-[#211f60] text-white px-10 py-4 rounded-xl text-xl font-bold hover:bg-[#211f60]/90 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Play Again 🔄
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#211f60]/10 to-[#ffd230]/10 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Navigation */}
        <div className="text-center mb-8">
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setShowDefinitions(!showDefinitions)}
              className="flex items-center space-x-3 bg-white border-2 border-[#211f60] rounded-xl px-6 py-3 hover:bg-[#ffd230]/10 transition-all shadow-sm font-bold text-[#211f60]"
            >
              <BookOpen size={24} />
              <span>Vocabulary Help</span>
            </button>
          </div>
        </div>

        {/* Main game area */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-[#211f60]/10">
          {renderGamePhase()}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-[#211f60]/60">
          <p className="font-bold">Decision Navigator - Terronez 10 Decision-Making Game</p>
          <p className="text-sm">Building character through thoughtful choices</p>
        </div>
      </div>
    </div>
  );
};

export default DecisionNavigator;