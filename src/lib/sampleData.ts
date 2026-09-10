import { MedicalReport, Medicine, FamilyMember, UserProfile } from '@/types';

export const sampleUser: UserProfile = {
  id: 'user-1',
  name: 'Vedprakash',
  email: 'vedprakash@example.com',
  mobile: '+91 98765 43210',
  age: 28,
  gender: 'Male',
  language: 'en',
  emergencyContact: {
    name: 'Ramesh (Father)',
    phone: '+91 98765 11111',
    relation: 'Father'
  },
  bloodGroup: 'B+',
  allergies: ['Penicillin (Mild)']
};

export const sampleFamilyMembers: FamilyMember[] = [
  {
    id: 'fam-1',
    name: 'Vedprakash (You)',
    relation: 'Self',
    relationHi: 'स्वयं',
    age: 28,
    gender: 'Male',
    healthConditions: ['Mild Vitamin D deficiency']
  },
  {
    id: 'fam-2',
    name: 'Father (Ramesh)',
    relation: 'Father',
    relationHi: 'पिताजी',
    age: 58,
    gender: 'Male',
    healthConditions: ['Hypertension', 'Pre-diabetes']
  },
  {
    id: 'fam-3',
    name: 'Mother (Sunita)',
    relation: 'Mother',
    relationHi: 'माताजी',
    age: 54,
    gender: 'Female',
    healthConditions: ['Thyroid (Hypothyroidism)']
  },
  {
    id: 'fam-4',
    name: 'Sister (Pooja)',
    relation: 'Sister',
    relationHi: 'बहन',
    age: 24,
    gender: 'Female',
    healthConditions: ['Seasonal Allergies']
  }
];

export const sampleReports: MedicalReport[] = [
  {
    id: 'rep-cbc-june-2026',
    userId: 'user-1',
    fileName: 'Blood Test - June 2026.pdf',
    reportType: 'Blood Test',
    uploadedAt: '20 June 2026',
    status: 'Completed',
    language: 'en',
    overallScore: 84,
    summary:
      'Your Complete Blood Count (CBC) and Metabolic Panel indicate generally good physiological stability, though three parameters fall outside standard reference boundaries. Your Hemoglobin is slightly below reference range, suggesting mild anemia. Blood Sugar (Fasting) and LDL Cholesterol are moderately elevated and warrant lifestyle adjustments and consultation with your primary physician.',
    summaryHi:
      'आपकी कम्पलीट ब्लड काउंट (CBC) और मेटाबॉलिक रिपोर्ट दर्शाती है कि आपकी समग्र सेहत ठीक है, परंतु तीन जांचों के परिणाम सामान्य सीमा से बाहर हैं। आपका हीमोग्लोबिन सामान्य से कुछ कम है जो हल्के एनीमिया का संकेत हो सकता है। फास्टिंग ब्लड शुगर और एलडीएल कोलेस्ट्रॉल बढ़े हुए हैं, जिनके लिए जीवनशैली में सुधार और डॉक्टर से परामर्श की आवश्यकता है।',
    findings: [
      {
        test: 'Hemoglobin (Hb)',
        testHi: 'हीमोग्लोबिन (Hb)',
        value: '10.8',
        unit: 'g/dL',
        referenceRange: '12.0 - 16.0',
        status: 'low',
        explanation:
          'Hemoglobin is the protein in your red blood cells responsible for carrying oxygen throughout your body. Your value is below the laboratory reference range.',
        explanationHi:
          'हीमोग्लोबिन लाल रक्त कोशिकाओं में पाया जाने वाला प्रोटीन है जो पूरे शरीर में ऑक्सीजन पहुंचाता है। आपका स्तर सामान्य सीमा (12-16) से कम है।',
        possibleMeaning:
          'This may contribute to mild fatigue, lower stamina, or mild pale skin. Often associated with dietary iron or vitamin deficiency.',
        possibleMeaningHi:
          'इसके कारण थकान, कमजोरी या ऊर्जा में कमी महसूस हो सकती है। यह आमतौर पर भोजन में आयरन या विटामिन की कमी से संबंधित हो सकता है।',
        confidence: 0.99
      },
      {
        test: 'Fasting Blood Sugar (Glucose)',
        testHi: 'फास्टिंग ब्लड शुगर (ग्लूकोज)',
        value: '140',
        unit: 'mg/dL',
        referenceRange: '70 - 110',
        status: 'high',
        explanation:
          'Measures circulating glucose levels in your bloodstream after an 8-hour fast. Your recorded level is higher than typical fasting reference boundaries.',
        explanationHi:
          '8 घंटे के उपवास के बाद रक्त में शुगर के स्तर को मापता है। आपका स्तर सामान्य संदर्भ सीमा (70-110) से अधिक है।',
        possibleMeaning:
          'Elevated fasting glucose can indicate impaired glucose tolerance or early insulin resistance. A physician may recommend an HbA1c test.',
        possibleMeaningHi:
          'यह इंसुलिन प्रतिरोध या प्रीडायबिटीज का संकेत हो सकता है। डॉक्टर आपको 3 महीने वाली HbA1c जांच कराने की सलाह दे सकते हैं।',
        confidence: 0.98
      },
      {
        test: 'Total Cholesterol',
        testHi: 'टोटल कोलेस्ट्रॉल',
        value: '210',
        unit: 'mg/dL',
        referenceRange: '< 200',
        status: 'high',
        explanation:
          'Total amount of cholesterol fats found in your bloodstream. Your reading is slightly above the desirable upper threshold of 200 mg/dL.',
        explanationHi:
          'रक्त में वसा (फैट) की कुल मात्रा। आपका मान अनुशंसित 200 mg/dL की सीमा से थोड़ा अधिक है।',
        possibleMeaning:
          'Borderline high cholesterol can be influenced by diet, physical activity, or genetic predispositions. Requires heart-healthy diet changes.',
        possibleMeaningHi:
          'यह आहार, शारीरिक निष्क्रियता या अनुवांशिकी से प्रभावित हो सकता है। हृदय-स्वस्थ खानपान अपनाने की आवश्यकता है।',
        confidence: 0.97
      },
      {
        test: 'LDL Cholesterol (Bad Fat)',
        testHi: 'एलडीएल कोलेस्ट्रॉल (खराब वसा)',
        value: '170',
        unit: 'mg/dL',
        referenceRange: '< 100',
        status: 'high',
        explanation:
          'Low-density lipoprotein cholesterol can accumulate in blood vessels over time. Your value is above optimal cardiovascular targets.',
        explanationHi:
          'यह धमनियों में जमा हो सकने वाला खराब कोलेस्ट्रॉल है। आपका मान सामान्य 100 से अधिक है।',
        possibleMeaning:
          'Consistent elevation increases future cardiovascular strain. Modifying dietary saturated fats and regular brisk walking are typically advised.',
        possibleMeaningHi:
          'लंबे समय तक अधिक रहने पर यह दिल पर दबाव बढ़ा सकता है। तली-भुनी चीजों से परहेज और नियमित सैर की सलाह दी जाती है।',
        confidence: 0.96
      },
      {
        test: 'HDL Cholesterol (Good Fat)',
        testHi: 'एचडीएल कोलेस्ट्रॉल (अच्छा वसा)',
        value: '40',
        unit: 'mg/dL',
        referenceRange: '> 40',
        status: 'low',
        explanation:
          'High-density lipoprotein protects blood vessels by clearing excess fats. Your level is borderline on the protective minimum mark.',
        explanationHi:
          'यह दिल की रक्षा करने वाला सुरक्षात्मक कोलेस्ट्रॉल है। आपका स्तर 40 के निचले स्तर पर है।',
        possibleMeaning:
          'Higher HDL levels are protective. Aerobic exercise, nuts, and healthy seeds help boost HDL.',
        possibleMeaningHi:
          'नियमित व्यायाम, बादाम-अखरोट और स्वस्थ तेलों के सेवन से इसे बढ़ाया जा सकता है।',
        confidence: 0.95
      }
    ],
    normalValues: [
      {
        test: 'Red Blood Cell (RBC) Count',
        testHi: 'लाल रक्त कोशिका (RBC) गणना',
        value: '4.2',
        unit: 'mill/mcL',
        referenceRange: '4.0 - 5.5',
        status: 'normal'
      },
      {
        test: 'White Blood Cell (WBC) Count',
        testHi: 'श्वेत रक्त कोशिका (WBC) गणना',
        value: '8,500',
        unit: '/mcL',
        referenceRange: '4,000 - 11,000',
        status: 'normal'
      },
      {
        test: 'Platelet Count',
        testHi: 'प्लेटलेट्स काउंट',
        value: '2.5',
        unit: 'Lakhs/mcL',
        referenceRange: '1.5 - 4.0',
        status: 'normal'
      },
      {
        test: 'Triglycerides',
        testHi: 'ट्राइग्लिसराइड्स',
        value: '135',
        unit: 'mg/dL',
        referenceRange: '< 150',
        status: 'normal'
      },
      {
        test: 'Blood Urea Nitrogen (BUN)',
        testHi: 'ब्लड यूरिया नाइट्रोजन (BUN)',
        value: '14',
        unit: 'mg/dL',
        referenceRange: '7 - 20',
        status: 'normal'
      },
      {
        test: 'Serum Creatinine',
        testHi: 'सीरम क्रिएटिनिन',
        value: '0.9',
        unit: 'mg/dL',
        referenceRange: '0.7 - 1.3',
        status: 'normal'
      }
    ],
    medicalTerms: [
      {
        term: 'Hemoglobin',
        termHi: 'हीमोग्लोबिन',
        simpleMeaning: 'An iron-rich protein in red blood cells that transports vital oxygen from your lungs to every muscle and organ in your body.',
        simpleMeaningHi: 'लाल रक्त कोशिकाओं में मौजूद प्रोटीन जो फेफड़ों से पूरे शरीर में ऑक्सीजन ले जाने का काम करता है।',
        whyMeasured: 'Tested to detect anemias, bleeding, bone marrow health, or nutrient deficiencies.',
        whyMeasuredHi: 'खून की कमी (एनीमिया) और समग्र शारीरिक ऊर्जा की स्थिति जांचने के लिए मापा जाता है।'
      },
      {
        term: 'LDL Cholesterol',
        termHi: 'एलडीएल कोलेस्ट्रॉल',
        simpleMeaning: 'Often nicknamed "bad cholesterol" because high amounts can stick to artery walls, narrowing passages over many years.',
        simpleMeaningHi: 'इसे "खराब कोलेस्ट्रॉल" कहा जाता है क्योंकि अधिक होने पर यह धमनियों में जमा होने लगता है।',
        whyMeasured: 'Used to gauge cardiovascular health risk and guide preventative nutrition.',
        whyMeasuredHi: 'हृदय स्वास्थ्य और धमनियों की सुरक्षा का आकलन करने के लिए।'
      },
      {
        term: 'Platelets',
        termHi: 'प्लेटलेट्स',
        simpleMeaning: 'Tiny blood cell fragments that rush to form clots whenever you experience a cut or minor injury.',
        simpleMeaningHi: 'रक्त के छोटे कण जो चोट लगने पर खून का थक्का जमाकर खून बहने से रोकते हैं।',
        whyMeasured: 'Ensures your blood can properly clot and rules out viral or bone marrow irregularities.',
        whyMeasuredHi: 'यह सुनिश्चित करने के लिए कि खून सामान्य रूप से जमता है या नहीं।'
      }
    ],
    doctorQuestions: [
      {
        id: 'q1',
        question: 'Should I repeat the Hemoglobin and Fasting Sugar test in 4 to 6 weeks?',
        questionHi: 'क्या मुझे 4 से 6 सप्ताह में हीमोग्लोबिन और फास्टिंग शुगर की जांच दोबारा करानी चाहिए?'
      },
      {
        id: 'q2',
        question: 'Would you recommend an HbA1c test to assess my average 3-month blood sugar?',
        questionHi: 'क्या पिछले 3 महीनों की औसत शुगर जानने के लिए HbA1c टेस्ट कराना उचित रहेगा?'
      },
      {
        id: 'q3',
        question: 'What specific dietary changes do you advise to lower LDL cholesterol naturally without immediately starting medication?',
        questionHi: 'दवा के बिना प्राकृतिक रूप से एलडीएल कोलेस्ट्रॉल कम करने के लिए मुझे खानपान में क्या बदलाव करने चाहिए?'
      },
      {
        id: 'q4',
        question: 'Could my mild fatigue be directly attributed to the 10.8 g/dL hemoglobin level?',
        questionHi: 'क्या मेरी हल्की थकान का सीधा संबंध 10.8 g/dL हीमोग्लोबिन स्तर से हो सकता है?'
      }
    ],
    suggestions: [
      {
        category: 'lifestyle',
        title: 'Incorporate Iron-Rich Whole Foods',
        titleHi: 'आयरन युक्त प्राकृतिक खाद्य पदार्थ खाएं',
        description: 'Include spinach, beetroot, lentils, pomegranate, seeds, and vitamin C foods (lemons, amla) which enhance iron absorption.',
        descriptionHi: 'पालक, चुकंदर, दालें, अनार और आंवला जैसे विटामिन सी युक्त आहार लें जो आयरन सोखने में मदद करते हैं।'
      },
      {
        category: 'lifestyle',
        title: 'Aim for 30 Minutes of Daily Aerobic Activity',
        titleHi: 'प्रतिदिन 30 मिनट हल्की कसरत या तेज चाल करें',
        description: 'Brisk walking or cycling improves cellular insulin sensitivity and helps boost HDL good cholesterol.',
        descriptionHi: 'रोजाना 30 मिनट टहलना शुगर के स्तर को संतुलित रखने और अच्छे कोलेस्ट्रॉल को बढ़ाने में सहायक होता है।'
      },
      {
        category: 'doctor',
        title: 'Discuss Results with Healthcare Provider',
        titleHi: 'डॉक्टर से रिपोर्ट पर विस्तार से चर्चा करें',
        description: 'Schedule a routine consultation to contextualize these findings with your medical history and family predispositions.',
        descriptionHi: 'अपने पारिवारिक इतिहास और लक्षणों के अनुसार उचित सलाह हेतु डॉक्टर से परामर्श अवश्य लें।'
      },
      {
        category: 'testing',
        title: 'Keep Historical Reports Organized for Comparison',
        titleHi: 'पिछली रिपोर्ट्स को संभाल कर रखें',
        description: 'Maintain this digital record so your physician can evaluate rate of change across checkups.',
        descriptionHi: 'अगले चेकअप में डॉक्टर को दिखाने के लिए इस डिजिटल रिकॉर्ड को सुरक्षित रखें।'
      }
    ],
    riskAnalysis: [
      {
        name: 'Heart Health Risk',
        nameHi: 'हृदय स्वास्थ्य जोखिम',
        riskPercentage: 72,
        riskLevel: 'High Risk',
        riskLevelHi: 'उच्च जोखिम',
        color: '#ef4444'
      },
      {
        name: 'Diabetes Risk',
        nameHi: 'डायबिटीज जोखिम',
        riskPercentage: 65,
        riskLevel: 'Moderate Risk',
        riskLevelHi: 'मध्यम जोखिम',
        color: '#f59e0b'
      },
      {
        name: 'Kidney Health Risk',
        nameHi: 'किडनी स्वास्थ्य जोखिम',
        riskPercentage: 20,
        riskLevel: 'Low Risk',
        riskLevelHi: 'कम जोखिम',
        color: '#10b981'
      },
      {
        name: 'Liver Health Risk',
        nameHi: 'लिवर स्वास्थ्य जोखिम',
        riskPercentage: 15,
        riskLevel: 'Low Risk',
        riskLevelHi: 'कम जोखिम',
        color: '#10b981'
      }
    ],
    comparison: {
      previousReportName: 'Blood Test - May 2026',
      previousDate: '15 May 2026',
      currentReportName: 'Blood Test - June 2026',
      currentDate: '20 June 2026',
      comparisons: [
        {
          test: 'Hemoglobin',
          oldValue: '11.4 g/dL',
          newValue: '10.8 g/dL',
          referenceRange: '12 - 16 g/dL',
          change: 'declined',
          changeText: 'Decreased by 0.6 g/dL. Discuss dietary iron with physician.',
          changeTextHi: '0.6 g/dL कम हुआ है। डॉक्टर से आहार पर चर्चा करें।'
        },
        {
          test: 'Blood Sugar (F)',
          oldValue: '128 mg/dL',
          newValue: '140 mg/dL',
          referenceRange: '70 - 110 mg/dL',
          change: 'declined',
          changeText: 'Increased by 12 mg/dL. Requires tighter dietary carbohydrate tracking.',
          changeTextHi: '12 mg/dL की वृद्धि हुई। मीठे और कार्बोहाइड्रेट पर नियंत्रण रखें।'
        },
        {
          test: 'Total Cholesterol',
          oldValue: '225 mg/dL',
          newValue: '210 mg/dL',
          referenceRange: '< 200 mg/dL',
          change: 'improved',
          changeText: 'Improved by 15 mg/dL compared to May report.',
          changeTextHi: 'मई की तुलना में 15 mg/dL का अच्छा सुधार हुआ।'
        }
      ]
    },
    confidenceThresholdMet: true
  },
  {
    id: 'rep-thyroid-may-2026',
    userId: 'user-1',
    familyMemberId: 'fam-3',
    fileName: 'Thyroid Test - May 2026.pdf',
    reportType: 'Blood Test',
    uploadedAt: '15 May 2026',
    status: 'Completed',
    language: 'en',
    overallScore: 90,
    summary:
      'Thyroid stimulated hormone (TSH) is well-regulated within standard target therapeutic ranges under ongoing supervision. T3 and T4 levels are normal.',
    summaryHi:
      'थायरॉयड स्टिमुलेटिंग हार्मोन (TSH) सामान्य चिकित्सीय सीमा के भीतर संतुलित है। T3 और T4 का स्तर भी सामान्य है।',
    findings: [
      {
        test: 'TSH (Ultrasensitive)',
        testHi: 'टी.एस.एच (TSH)',
        value: '2.8',
        unit: 'uIU/mL',
        referenceRange: '0.4 - 4.2',
        status: 'normal',
        explanation: 'Thyroid Stimulating Hormone is within healthy functional limits.',
        explanationHi: 'थायरॉयड स्टिमुलेटिंग हार्मोन सामान्य और स्वस्थ स्तर पर है।',
        possibleMeaning: 'Current thyroid regulation is stable.',
        possibleMeaningHi: 'थायरॉयड ग्रंथि सुचारू रूप से कार्य कर रही है।',
        confidence: 0.99
      }
    ],
    normalValues: [
      {
        test: 'Total Triiodothyronine (T3)',
        testHi: 'टी-3 (T3)',
        value: '1.2',
        unit: 'ng/mL',
        referenceRange: '0.8 - 2.0',
        status: 'normal'
      },
      {
        test: 'Total Thyroxine (T4)',
        testHi: 'टी-4 (T4)',
        value: '8.4',
        unit: 'ug/dL',
        referenceRange: '5.1 - 14.1',
        status: 'normal'
      }
    ],
    medicalTerms: [
      {
        term: 'TSH',
        termHi: 'टी.एस.एच',
        simpleMeaning: 'A hormone made by the pituitary gland that commands your thyroid how much hormone to manufacture.',
        simpleMeaningHi: 'मस्तिष्क द्वारा उत्पादित हार्मोन जो थायरॉयड को हार्मोन बनाने का संदेश देता है।',
        whyMeasured: 'Detects overactive or underactive thyroid metabolism.',
        whyMeasuredHi: 'थायरॉयड ग्रंथि के कम या अधिक सक्रिय होने की जांच हेतु।'
      }
    ],
    doctorQuestions: [
      {
        id: 'qt1',
        question: 'Should the current dosage be maintained as is?',
        questionHi: 'क्या वर्तमान दवा की खुराक इसी तरह जारी रखनी चाहिए?'
      }
    ],
    suggestions: [
      {
        category: 'testing',
        title: 'Routine 6-Month Thyroid Followup',
        titleHi: '6 महीने में नियमित थायरॉयड जांच कराएं',
        description: 'Continue standard biannual testing as recommended by endocrinologist.',
        descriptionHi: 'डॉक्टर की सलाह अनुसार हर 6 महीने में जांच दोहराएं।'
      }
    ],
    riskAnalysis: [
      {
        name: 'Thyroid Balance',
        nameHi: 'थायरॉयड संतुलन',
        riskPercentage: 10,
        riskLevel: 'Low Risk',
        riskLevelHi: 'कम जोखिम',
        color: '#10b981'
      }
    ],
    confidenceThresholdMet: true
  },
  {
    id: 'rep-lipid-apr-2026',
    userId: 'user-1',
    fileName: 'Full Body Checkup - April 2026.pdf',
    reportType: 'Health Checkup',
    uploadedAt: '12 April 2026',
    status: 'Completed',
    language: 'en',
    overallScore: 78,
    summary:
      'Full body checkup revealed elevated triglycerides and mild fatty liver indicators. Kidney function and electrolytes remained entirely healthy.',
    summaryHi:
      'संपूर्ण स्वास्थ्य जांच में ट्राइग्लिसराइड्स में वृद्धि और हल्के फैटी लिवर के संकेत पाए गए। किडनी फंक्शन और इलेक्ट्रोलाइट्स पूरी तरह सामान्य रहे।',
    findings: [
      {
        test: 'Serum Triglycerides',
        testHi: 'सीरम ट्राइग्लिसराइड्स',
        value: '198',
        unit: 'mg/dL',
        referenceRange: '< 150',
        status: 'high',
        explanation: 'Elevated circulating neutral blood fats.',
        explanationHi: 'रक्त में वसा की मात्रा थोड़ी अधिक है।',
        possibleMeaning: 'Commonly linked with simple sugars and refined flour in diet.',
        possibleMeaningHi: 'आमतौर पर मीठे और मैदे के अधिक सेवन से जुड़ा होता है।',
        confidence: 0.98
      }
    ],
    normalValues: [
      {
        test: 'Serum Potassium',
        testHi: 'सीरम पोटेशियम',
        value: '4.4',
        unit: 'mEq/L',
        referenceRange: '3.5 - 5.0',
        status: 'normal'
      },
      {
        test: 'Serum Sodium',
        testHi: 'सीरम सोडियम',
        value: '141',
        unit: 'mEq/L',
        referenceRange: '135 - 145',
        status: 'normal'
      }
    ],
    medicalTerms: [
      {
        term: 'Triglycerides',
        termHi: 'ट्राइग्लिसराइड्स',
        simpleMeaning: 'The most common type of fat in your body, storing unused calories from food.',
        simpleMeaningHi: 'शरीर में पाई जाने वाली वसा का मुख्य प्रकार जो भोजन की अतिरिक्त कैलोरी से बनता है।',
        whyMeasured: 'Important factor in assessing cardiovascular risk.',
        whyMeasuredHi: 'हार्ट रिस्क जांचने का महत्वपूर्ण कारक।'
      }
    ],
    doctorQuestions: [
      {
        id: 'ql1',
        question: 'What dietary changes are most effective in reducing triglycerides?',
        questionHi: 'ट्राइग्लिसराइड्स कम करने के लिए कौन से खाद्य पदार्थ बंद करने चाहिए?'
      }
    ],
    suggestions: [
      {
        category: 'lifestyle',
        title: 'Reduce Refined Carbohydrates & Sweetened Beverages',
        titleHi: 'मीठे पेय पदार्थ और मैदे का सेवन कम करें',
        description: 'Swapping refined foods with oats, barley, and whole grains significantly curbs lipid build-up.',
        descriptionHi: 'ओट्स, दलिया और साबुत अनाज का सेवन बढ़ाएं।'
      }
    ],
    riskAnalysis: [
      {
        name: 'Cardiovascular Risk',
        nameHi: 'हार्ट रिस्क',
        riskPercentage: 55,
        riskLevel: 'Moderate Risk',
        riskLevelHi: 'मध्यम जोखिम',
        color: '#f59e0b'
      }
    ],
    confidenceThresholdMet: true
  },
  {
    id: 'rep-hba1c-june-2026',
    userId: 'user-1',
    familyMemberId: 'fam-2',
    fileName: 'Diabetes HbA1c Panel - June 2026.pdf',
    reportType: 'Blood Test',
    uploadedAt: '18 June 2026',
    status: 'Completed',
    language: 'en',
    overallScore: 71,
    summary:
      'Glycated Hemoglobin (HbA1c) is 7.4%, which lies in the diabetic range (target for non-diabetics is under 5.7%). Estimated Average Glucose (eAG) is elevated at 165 mg/dL. Fasting and post-prandial sugars indicate persistent hyperglycemia requiring physician review for anti-diabetic medical management and glycemic diet control.',
    summaryHi:
      'ग्लाइकेटेड हीमोग्लोबिन (HbA1c) 7.4% है, जो मधुमेह (डायबिटीज) की श्रेणी में आता है (सामान्य स्तर 5.7% से कम होता है)। पिछले 3 महीनों का औसत ग्लूकोज 165 mg/dL दर्ज किया गया है। शुगर नियंत्रण और दवा प्रबंधन के लिए तुरंत डॉक्टर से परामर्श लेने की आवश्यकता है।',
    findings: [
      {
        test: 'HbA1c (Glycated Hemoglobin)',
        testHi: 'एचबीए1सी (HbA1c)',
        value: '7.4',
        unit: '%',
        referenceRange: '< 5.7',
        status: 'high',
        explanation: 'Measures the percentage of hemoglobin coated with sugar over the previous 90 to 120 days.',
        explanationHi: 'यह पिछले 3 महीनों में हीमोग्लोबिन से चिपकी शुगर का औसत प्रतिशत मापता है।',
        possibleMeaning: 'Values 6.5% and above confirm diabetes. Tight glycemic monitoring is required.',
        possibleMeaningHi: '6.5% या अधिक मान डायबिटीज की पुष्टि करते हैं। नियमित निगरानी आवश्यक है।',
        confidence: 0.99
      },
      {
        test: 'Estimated Average Glucose (eAG)',
        testHi: 'अनुमानित औसत ग्लूकोज (eAG)',
        value: '165',
        unit: 'mg/dL',
        referenceRange: '< 117',
        status: 'high',
        explanation: 'Calculated 3-month daily blood sugar average derived from HbA1c.',
        explanationHi: 'HbA1c से निकाली गई पिछले 3 महीनों की औसत दैनिक ब्लड शुगर।',
        possibleMeaning: 'Shows daily average blood sugar has consistently stayed above safe non-diabetic thresholds.',
        possibleMeaningHi: 'दर्शाता है कि दैनिक ब्लड शुगर लगातार सामान्य से अधिक रही है।',
        confidence: 0.98
      },
      {
        test: 'Post Prandial Blood Sugar (PP)',
        testHi: 'भोजन के बाद ब्लड शुगर (PP)',
        value: '195',
        unit: 'mg/dL',
        referenceRange: '< 140',
        status: 'high',
        explanation: 'Circulating blood sugar 2 hours after a meal.',
        explanationHi: 'खाना खाने के 2 घंटे बाद रक्त में ग्लूकोज की मात्रा।',
        possibleMeaning: 'Spikes after meals indicate delayed pancreatic insulin response to carbohydrate intake.',
        possibleMeaningHi: 'खाने के बाद शुगर का बढ़ना धीमे इंसुलिन स्राव का संकेत देता है।',
        confidence: 0.97
      }
    ],
    normalValues: [
      {
        test: 'Urine Microalbumin',
        testHi: 'यूरिन माइक्रोएल्ब्यूमिन',
        value: '18',
        unit: 'mg/L',
        referenceRange: '< 30',
        status: 'normal'
      },
      {
        test: 'Serum Creatinine',
        testHi: 'सीरम क्रिएटिनिन',
        value: '0.85',
        unit: 'mg/dL',
        referenceRange: '0.7 - 1.3',
        status: 'normal'
      }
    ],
    medicalTerms: [
      {
        term: 'HbA1c',
        termHi: 'एचबीए1सी',
        simpleMeaning: 'The 3-month average memory of your blood sugar levels.',
        simpleMeaningHi: 'पिछले 90 दिनों की औसत ब्लड शुगर की सटीक रिपोर्ट।',
        whyMeasured: 'Gold standard for diagnosing and managing diabetes over time.',
        whyMeasuredHi: 'डायबिटीज के इलाज और नियंत्रण को परखने का सबसे विश्वसनीय टेस्ट।'
      }
    ],
    doctorQuestions: [
      {
        id: 'qh1',
        question: 'What is my target HbA1c goal over the next 3 to 6 months?',
        questionHi: 'अगले 3-6 महीनों में मेरा लक्षित HbA1c कितना होना चाहिए?'
      },
      {
        id: 'qh2',
        question: 'Should I start oral anti-diabetic medication like Metformin?',
        questionHi: 'क्या मुझे मेटफॉर्मिन जैसी शुगर की दवा शुरू करनी चाहिए?'
      }
    ],
    suggestions: [
      {
        category: 'lifestyle',
        title: 'Adopt Low Glycemic Index (GI) Carbohydrates',
        titleHi: 'कम ग्लाइसेमिक इंडेक्स वाले खाद्य पदार्थ लें',
        description: 'Substitute white rice and white bread with whole grains, millets (ragi, bajra), and plenty of green leafy vegetables.',
        descriptionHi: 'सफेद चावल और मैदे की जगह रागी, बाजरा, जौ और हरी पत्तेदार सब्जियां खाएं।'
      },
      {
        category: 'lifestyle',
        title: 'Post-Meal 15-Minute Walks',
        titleHi: 'भोजन के बाद 15 मिनट टहलें',
        description: 'Light walking right after meals drastically flattens post-prandial blood sugar spikes.',
        descriptionHi: 'खाने के बाद हल्की चाल शुगर स्पाइक को कम करने में बहुत असरदार है।'
      }
    ],
    riskAnalysis: [
      {
        name: 'Diabetes / Glycemic Risk',
        nameHi: 'डायबिटीज जोखिम',
        riskPercentage: 82,
        riskLevel: 'High Risk',
        riskLevelHi: 'उच्च जोखिम',
        color: '#ef4444'
      },
      {
        name: 'Cardiovascular Risk',
        nameHi: 'हृदय जोखिम',
        riskPercentage: 60,
        riskLevel: 'Moderate Risk',
        riskLevelHi: 'मध्यम जोखिम',
        color: '#f59e0b'
      }
    ],
    confidenceThresholdMet: true
  }
];

export const sampleMedicines: Medicine[] = [
  {
    id: 'med-1',
    userId: 'user-1',
    name: 'Dolo 650',
    strength: '650 mg',
    form: 'Tablet',
    manufacturer: 'Micro Labs Limited',
    dosageInstruction: '1 tablet after lunch',
    dosageInstructionHi: 'दोपहर के भोजन के बाद 1 गोली',
    frequency: 'Once daily',
    timeSlot: 'Afternoon',
    scheduledTime: '02:00 PM',
    startDate: '2026-06-15',
    status: 'Upcoming',
    description: 'Paracetamol (acetaminophen) is an analgesic and antipyretic agent used for fever reduction and mild-to-moderate aches.',
    descriptionHi: 'पैरासिटामोल दर्द निवारक और बुखार कम करने वाली लोकप्रिय दवा है।',
    commonUses: [
      'Relief of fever and body temperature elevation',
      'Mild headache, muscle aches, and body pain',
      'Joint pain or discomfort during flu'
    ],
    commonUsesHi: [
      'बुखार कम करने के लिए',
      'सिरदर्द, बदन दर्द और मांसपेशियों के दर्द में राहत',
      'फ्लू या मौसमी सर्दी-जुकाम में आराम'
    ],
    precautions: [
      'Do not exceed 4,000 mg of paracetamol across all medications in 24 hours',
      'Avoid consuming with alcohol to protect liver function',
      'Check other cold and cough medicines to avoid accidental duplicate paracetamol intake'
    ],
    precautionsHi: [
      '24 घंटे में अधिकतम निर्धारित मात्रा से अधिक न लें',
      'लिवर की सुरक्षा के लिए शराब के साथ इसका सेवन न करें',
      'अन्य दवाओं के साथ दोहराव से बचें'
    ],
    sideEffects: [
      'Nausea or mild stomach upset (rare)',
      'Skin rash or allergic reactions (very rare)',
      'Liver stress if taken in excessive prolonged doses'
    ],
    sideEffectsHi: [
      'कभी-कभार हल्का जी मिचलाना',
      'त्वचा पर एलर्जी (बहुत दुर्लभ)',
      'अत्यधिक मात्रा में लेने पर लिवर पर असर'
    ],
    whenToSeekHelp: 'Seek medical care immediately if fever persists over 3 days, or if you experience yellowing of eyes/skin, dark urine, or extreme nausea.',
    whenToSeekHelpHi: 'यदि 3 दिन से अधिक बुखार बना रहे या त्वचा/आंखों में पीलापन दिखे, तो तुरंत डॉक्टर से संपर्क करें।',
    extractedFromPhoto: true,
    confidenceScore: 0.99
  },
  {
    id: 'med-2',
    userId: 'user-1',
    name: 'Augmentin 625',
    strength: '625 mg',
    form: 'Tablet',
    manufacturer: 'GlaxoSmithKline (GSK)',
    dosageInstruction: '1 tablet after breakfast',
    dosageInstructionHi: 'नाश्ते के बाद 1 गोली',
    frequency: 'Twice daily',
    timeSlot: 'Morning',
    scheduledTime: '09:00 AM',
    startDate: '2026-06-18',
    status: 'Taken',
    takenAt: '09:15 AM',
    description: 'A combination antibiotic containing Amoxicillin (500mg) and Clavulanic Acid (125mg) to treat bacterial infections.',
    descriptionHi: 'एमोक्सिसिलिन और क्लैवुलैनिक एसिड का कॉम्बिनेशन जो बैक्टीरियल संक्रमण के इलाज में काम आता है।',
    commonUses: [
      'Bacterial respiratory tract infections',
      'Ear, nose, and throat infections (sinusitis, tonsillitis)',
      'Skin and soft tissue bacterial infections'
    ],
    commonUsesHi: [
      'श्वसन तंत्र का जीवाणु संक्रमण',
      'कान, नाक और गले का इन्फेक्शन',
      'त्वचा और घाव का संक्रमण'
    ],
    precautions: [
      'Always complete the prescribed antibiotic course even if you feel completely well',
      'Inform doctor immediately if you have a known penicillin allergy',
      'Take with food to minimize gastrointestinal discomfort'
    ],
    precautionsHi: [
      'डॉक्टर द्वारा बताया गया पूरा कोर्स खत्म करें',
      'पेनिसिलिन से एलर्जी होने पर डॉक्टर को पहले बताएं',
      'पेट की खराबी से बचने के लिए भोजन के बाद ही लें'
    ],
    sideEffects: [
      'Mild diarrhea or loose stools',
      'Mild stomach cramps',
      'Nausea'
    ],
    sideEffectsHi: [
      'हल्के दस्त या पेट में मरोड़',
      'जी मिचलाना'
    ],
    whenToSeekHelp: 'Contact emergency medical care if you develop breathing difficulties, swelling of lips/throat, or severe watery diarrhea.',
    whenToSeekHelpHi: 'सांस लेने में कठिनाई या होंठ/गले में सूजन आने पर तुरंत आपातकालीन चिकित्सा सहायता लें।',
    extractedFromPhoto: true,
    confidenceScore: 0.98
  },
  {
    id: 'med-3',
    userId: 'user-1',
    name: 'Vitamin D3 60K',
    strength: '60,000 IU',
    form: 'Capsule',
    manufacturer: 'Cadila Pharmaceuticals',
    dosageInstruction: '1 capsule after dinner with milk',
    dosageInstructionHi: 'रात के खाने के बाद दूध के साथ 1 कैप्सूल',
    frequency: 'Once daily',
    timeSlot: 'Night',
    scheduledTime: '08:00 PM',
    startDate: '2026-06-01',
    status: 'Upcoming',
    description: 'Cholecalciferol high-dose supplement essential for calcium absorption, bone strength, and immune defense.',
    descriptionHi: 'कोलेकैल्सिफेरॉल (विटामिन डी3) हड्डियों की मजबूती और रोग प्रतिरोधक क्षमता के लिए आवश्यक है।',
    commonUses: [
      'Correction of Vitamin D deficiency',
      'Strengthening bone density and tooth enamel',
      'Immune system support'
    ],
    commonUsesHi: [
      'विटामिन डी की कमी को दूर करना',
      'हड्डियों और जोड़ों को मजबूत बनाना',
      'प्रतिरोधक क्षमता बढ़ाना'
    ],
    precautions: [
      'Best absorbed when ingested with dietary fats or a cup of warm milk',
      'Follow prescribed weekly/daily dosage schedule carefully to prevent hypercalcemia'
    ],
    precautionsHi: [
      'दूध या वसायुक्त भोजन के साथ लेने से शरीर में इसका अवशोषण बेहतर होता है',
      'अत्यधिक मात्रा में न लें'
    ],
    sideEffects: [
      'Generally well-tolerated with no side effects at prescribed levels'
    ],
    sideEffectsHi: [
      'सामान्यतः कोई दुष्प्रभाव नहीं होता'
    ],
    whenToSeekHelp: 'Consult your doctor if you experience unexplained persistent thirst or nausea.',
    whenToSeekHelpHi: 'अत्यधिक प्यास या उल्टी जैसा महसूस होने पर डॉक्टर से सलाह लें।',
    extractedFromPhoto: false,
    confidenceScore: 1.0
  },
  {
    id: 'med-4',
    userId: 'user-1',
    name: 'Pantoprazole 40',
    strength: '40 mg',
    form: 'Tablet',
    manufacturer: 'Alkem Laboratories',
    dosageInstruction: '1 tablet 30 minutes before breakfast',
    dosageInstructionHi: 'नाश्ते से 30 मिनट पहले खाली पेट 1 गोली',
    frequency: 'Once daily',
    timeSlot: 'Morning',
    scheduledTime: '07:00 AM',
    startDate: '2026-06-18',
    status: 'Taken',
    takenAt: '07:05 AM',
    description: 'Proton Pump Inhibitor (PPI) that decreases stomach acid secretion to treat and prevent acidity and acid reflux.',
    descriptionHi: 'पेट में एसिड बनने को कम करने वाली दवा जो गैस और सीने की जलन से राहत देती है।',
    commonUses: [
      'Acid reflux and gastroesophageal reflux disease (GERD)',
      'Heartburn and gastric hyperacidity',
      'Stomach protection during antibiotic courses'
    ],
    commonUsesHi: [
      'एसिडिटी और सीने में जलन',
      'गैस की समस्या',
      'एंटीबायोटिक दवाओं से पेट की सुरक्षा'
    ],
    precautions: [
      'Take early morning on an empty stomach with a glass of water',
      'Swallow the tablet whole; do not chew or crush'
    ],
    precautionsHi: [
      'सुबह खाली पेट एक गिलास पानी के साथ लें',
      'गोली को चबाएं या तोड़ें नहीं, पूरी निगलें'
    ],
    sideEffects: ['Mild headache', 'Dry mouth', 'Mild flatulence'],
    sideEffectsHi: ['हल्का सिरदर्द', 'मुंह सूखना'],
    whenToSeekHelp: 'Notify doctor if severe abdominal pain or persistent vomiting occurs.',
    whenToSeekHelpHi: 'पेट में तेज दर्द होने पर डॉक्टर को दिखाएं।',
    extractedFromPhoto: false,
    confidenceScore: 1.0
  },
  {
    id: 'med-5',
    userId: 'user-1',
    name: 'Tab Amlodipine 5mg',
    strength: '5 mg',
    form: 'Tablet',
    manufacturer: 'Pfizer / Generic',
    dosageInstruction: '1-0-1 After Food (Twice daily)',
    dosageInstructionHi: '1-0-1 भोजन के बाद (दिन में दो बार)',
    frequency: 'Twice daily',
    timeSlot: 'Morning',
    scheduledTime: '08:30 AM',
    startDate: '2026-06-20',
    status: 'Upcoming',
    description: 'A calcium channel blocker prescribed for hypertension (high blood pressure) and chest pain prevention.',
    descriptionHi: 'हाई ब्लड प्रेशर को नियंत्रित करने वाली कैल्शियम चैनल ब्लॉकर दवा।',
    commonUses: ['Hypertension control', 'Preventing angina (chest pain)', 'Reducing cardiovascular strain'],
    commonUsesHi: ['हाई ब्लड प्रेशर का नियंत्रण', 'सीने के दर्द से बचाव', 'दिल के तनाव को कम करना'],
    precautions: ['Do not stop taking abruptly without doctor advice', 'Monitor blood pressure routinely'],
    precautionsHi: ['डॉक्टर की सलाह के बिना अचानक दवा बंद न करें', 'ब्लड प्रेशर नियमित मापते रहें'],
    sideEffects: ['Mild ankle swelling', 'Dizziness when standing rapidly', 'Flushing'],
    sideEffectsHi: ['पैरों के टखनों में हल्की सूजन', 'अचानक खड़े होने पर चक्कर आना'],
    whenToSeekHelp: 'Seek immediate attention if severe dizziness, rapid irregular heartbeat, or fainting occurs.',
    whenToSeekHelpHi: 'चक्कर आने या दिल की धड़कन तेज होने पर तुरंत डॉक्टर को दिखाएं।',
    extractedFromPhoto: true,
    confidenceScore: 0.96
  }
];

export const sampleHealthTrends = [
  { month: 'Jan', bloodSugar: 120, cholesterol: 195, hemoglobin: 11.8, weight: 71, bmi: 23.4 },
  { month: 'Feb', bloodSugar: 124, cholesterol: 202, hemoglobin: 11.6, weight: 71.5, bmi: 23.6 },
  { month: 'Mar', bloodSugar: 130, cholesterol: 215, hemoglobin: 11.2, weight: 72, bmi: 23.8 },
  { month: 'Apr', bloodSugar: 128, cholesterol: 225, hemoglobin: 11.4, weight: 72.8, bmi: 24.1 },
  { month: 'May', bloodSugar: 135, cholesterol: 218, hemoglobin: 11.0, weight: 72.5, bmi: 24.0 },
  { month: 'Jun', bloodSugar: 140, cholesterol: 210, hemoglobin: 10.8, weight: 73, bmi: 24.2 },
];

export const sampleDoctors = [
  {
    id: 'doc-1',
    name: 'Dr. Rajesh Sharma',
    nameHi: 'डॉ. राजेश शर्मा',
    specialty: 'Cardiologist',
    specialtyHi: 'हृदय रोग विशेषज्ञ (Cardiologist)',
    qualification: 'MD (Medicine), DM (Cardiology), FACC',
    experienceYears: 18,
    hospital: 'Max Super Speciality Hospital, Saket',
    rating: 4.9,
    reviewsCount: 342,
    consultationFee: 1200,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    slots: {
      morning: ['09:30 AM', '10:30 AM', '11:15 AM'],
      afternoon: ['01:30 PM', '02:15 PM'],
      evening: ['05:00 PM', '06:30 PM', '07:15 PM']
    }
  },
  {
    id: 'doc-2',
    name: 'Dr. Ananya Verma',
    nameHi: 'डॉ. अनन्या वर्मा',
    specialty: 'Endocrinologist & Diabetologist',
    specialtyHi: 'डायबिटीज व हार्मोन विशेषज्ञ (Endocrinologist)',
    qualification: 'MBBS, MD, DNB (Endocrinology)',
    experienceYears: 12,
    hospital: 'Apollo Hospitals, Indraprastha',
    rating: 4.8,
    reviewsCount: 289,
    consultationFee: 1000,
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    slots: {
      morning: ['10:00 AM', '11:00 AM', '11:45 AM'],
      afternoon: ['03:00 PM', '04:00 PM'],
      evening: ['06:00 PM', '07:00 PM']
    }
  },
  {
    id: 'doc-3',
    name: 'Dr. Vikram Mehta',
    nameHi: 'डॉ. विक्रम मेहता',
    specialty: 'General Physician & Internal Medicine',
    specialtyHi: 'वरिष्ठ सामान्य चिकित्सक (General Physician)',
    qualification: 'MBBS, MD (Internal Medicine)',
    experienceYears: 15,
    hospital: 'Fortis Memorial Research Institute',
    rating: 4.9,
    reviewsCount: 412,
    consultationFee: 800,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    slots: {
      morning: ['09:00 AM', '09:45 AM', '10:30 AM'],
      afternoon: ['02:00 PM', '02:45 PM'],
      evening: ['05:30 PM', '06:15 PM']
    }
  },
  {
    id: 'doc-4',
    name: 'Dr. Priya Nair',
    nameHi: 'डॉ. प्रिया नायर',
    specialty: 'Pulmonologist & Chest Specialist',
    specialtyHi: 'श्वसन व फेफड़ा रोग विशेषज्ञ (Pulmonologist)',
    qualification: 'MD (Chest & Respiratory Diseases), FCCP',
    experienceYears: 11,
    hospital: 'Medanta - The Medicity',
    rating: 4.7,
    reviewsCount: 198,
    consultationFee: 900,
    availableDays: ['Tue', 'Thu', 'Sat'],
    slots: {
      morning: ['10:30 AM', '11:30 AM'],
      afternoon: ['01:00 PM', '02:00 PM'],
      evening: ['04:30 PM', '05:45 PM']
    }
  }
];

export const sampleAppointments = [
  {
    id: 'apt-1',
    userId: 'user-1',
    doctorId: 'doc-1',
    doctorName: 'Dr. Rajesh Sharma',
    doctorSpecialty: 'Cardiologist',
    doctorHospital: 'Max Super Speciality Hospital',
    date: '2026-06-25',
    timeSlot: '10:30 AM',
    type: 'In-Person' as const,
    status: 'Upcoming' as const,
    reasonForVisit: 'Follow-up on elevated LDL Cholesterol (170 mg/dL) and cardiovascular risk assessment.',
    symptoms: ['Mild fatigue', 'Shortness of breath on fast stairs'],
    attachedReportIds: ['rep-cbc-june-2026'],
    notes: 'Please bring previous ECG records if available.',
    createdAt: '2026-06-20'
  },
  {
    id: 'apt-2',
    userId: 'user-1',
    doctorId: 'doc-2',
    doctorName: 'Dr. Ananya Verma',
    doctorSpecialty: 'Endocrinologist & Diabetologist',
    doctorHospital: 'Apollo Hospitals',
    date: '2026-06-28',
    timeSlot: '04:00 PM',
    type: 'Video Call' as const,
    status: 'Upcoming' as const,
    reasonForVisit: 'Discussion on Fasting Blood Sugar result (140 mg/dL) and dietary carbohydrates.',
    symptoms: ['Occasional morning thirst', 'Lethargy'],
    attachedReportIds: ['rep-cbc-june-2026'],
    notes: 'Tele-consultation link will be active 10 minutes prior.',
    createdAt: '2026-06-21'
  }
];

export const sampleConsultations = [
  {
    id: 'con-1',
    appointmentId: 'apt-past-1',
    userId: 'user-1',
    doctorName: 'Dr. Vikram Mehta',
    specialty: 'Internal Medicine',
    date: '12 April 2026',
    symptoms: ['General fatigue', 'Digestive heaviness after meals'],
    doctorNotes: 'Patient has mild lipid elevation. Prescribed dietary modifications and lifestyle intervention. Repeat complete metabolic profile in 2 months.',
    doctorNotesHi: 'मरीज के रक्त में लिपिड की हल्की वृद्धि है। आहार में बदलाव और व्यायाम की सलाह दी गई। 2 महीने बाद जांच दोहराएं।',
    diagnosisSuggestion: 'Borderline Dyslipidemia & Mild Vitamin D Insufficiency',
    prescribedMedicines: [
      { name: 'Vitamin D3 60K', dosage: '1 capsule weekly with milk', duration: '8 weeks' },
      { name: 'Pantoprazole 40', dosage: '1 tablet morning empty stomach', duration: '14 days' }
    ],
    attachedReportNames: ['Full Body Checkup - April 2026.pdf']
  }
];

export const sampleNotifications = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'medicine' as const,
    title: 'Time to take Dolo 650',
    titleHi: 'डोलो 650 लेने का समय हो गया है',
    message: 'Scheduled afternoon dose: 1 tablet after lunch (02:00 PM).',
    messageHi: 'दोपहर की खुराक: दोपहर के भोजन के बाद 1 गोली (02:00 PM)।',
    timestamp: '10 minutes ago',
    read: false,
    actionUrl: '/schedules'
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    type: 'appointment' as const,
    title: 'Upcoming Appointment with Dr. Rajesh Sharma',
    titleHi: 'डॉ. राजेश शर्मा के साथ आगामी अपॉइंटमेंट',
    message: 'Confirmed for 25 June 2026 at 10:30 AM (In-Person at Max Hospital).',
    messageHi: '25 जून 2026 को सुबह 10:30 बजे मैक्स अस्पताल में निश्चित किया गया।',
    timestamp: '1 hour ago',
    read: false,
    actionUrl: '/appointments'
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    type: 'report' as const,
    title: 'Blood Test - June 2026 Analysis Complete',
    titleHi: 'ब्लड टेस्ट - जून 2026 विश्लेषण तैयार है',
    message: 'AI has extracted 5 key parameters. 3 items are outside reference boundaries.',
    messageHi: 'एआई ने 5 प्रमुख पैरामीटर पढ़े हैं। 3 मान संदर्भ सीमा से बाहर हैं।',
    timestamp: 'Yesterday',
    read: true,
    actionUrl: '/reports/rep-cbc-june-2026'
  },
  {
    id: 'notif-4',
    userId: 'user-1',
    type: 'system' as const,
    title: 'HIPAA Data Encryption Active',
    titleHi: 'डेटा सुरक्षा सक्रिय',
    message: 'Your personal health records are protected with 256-bit AES encryption.',
    messageHi: 'आपके मेडिकल रिकॉर्ड्स 256-बिट एन्क्रिप्शन के साथ पूरी तरह सुरक्षित हैं।',
    timestamp: '3 days ago',
    read: true,
    actionUrl: '/settings'
  }
];

