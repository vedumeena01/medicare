import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import fs from 'fs';
import path from 'path';

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting Medicare SQLite Database Seeding...');

  // 1. Read existing data from data/medicare.db.json
  const dbPath = path.join(process.cwd(), 'data', 'medicare.db.json');
  if (!fs.existsSync(dbPath)) {
    throw new Error(`Source JSON database not found at ${dbPath}`);
  }

  const raw = fs.readFileSync(dbPath, 'utf-8');
  const data = JSON.parse(raw);

  const rawUser = data.user || {
    id: 'usr-1',
    name: 'Vedprakash',
    email: 'vedprakash@example.com',
    mobile: '+91 98765 00000',
    age: 28,
    gender: 'Male',
    language: 'en',
  };

  // 2. Clear existing records in child-to-parent order to avoid foreign key constraints
  console.log('🧹 Cleaning existing SQLite tables...');
  await prisma.familyMember.deleteMany();
  await prisma.medicine.deleteMany();
  await prisma.report.deleteMany();
  await prisma.user.deleteMany();

  // 3. Seed Primary User
  console.log(`👤 Seeding user: ${rawUser.name} (${rawUser.email})...`);
  const user = await prisma.user.create({
    data: {
      id: rawUser.id || 'usr-1',
      name: rawUser.name || 'Vedprakash',
      email: rawUser.email || 'vedprakash@example.com',
      mobile: rawUser.mobile || '+91 98765 00000',
      age: typeof rawUser.age === 'number' ? rawUser.age : 28,
      gender: rawUser.gender || 'Male',
      language: rawUser.language || 'en',
    },
  });

  // 4. Seed Reports
  const reports = data.reports || [];
  console.log(`📄 Seeding ${reports.length} diagnostic medical reports...`);
  for (const r of reports) {
    await prisma.report.create({
      data: {
        id: r.id,
        userId: user.id,
        familyMemberId: r.familyMemberId || null,
        fileName: r.fileName || 'Report.pdf',
        fileUrl: r.fileUrl || null,
        reportType: r.reportType || 'Blood Test',
        uploadedAt: r.uploadedAt || new Date().toISOString(),
        status: r.status || 'Completed',
        language: r.language || 'en',
        overallScore: typeof r.overallScore === 'number' ? r.overallScore : 85,
        summary: r.summary || '',
        summaryHi: r.summaryHi || '',
        findingsJson: JSON.stringify(r.findings || []),
        normalValuesJson: JSON.stringify(r.normalValues || []),
        medicalTermsJson: JSON.stringify(r.medicalTerms || []),
        doctorQuestionsJson: JSON.stringify(r.doctorQuestions || []),
        suggestionsJson: JSON.stringify(r.suggestions || []),
        riskAnalysisJson: JSON.stringify(r.riskAnalysis || []),
        comparisonJson: r.comparison ? JSON.stringify(r.comparison) : null,
      },
    });
  }

  // 5. Seed Medicines
  const medicines = data.medicines || [];
  console.log(`💊 Seeding ${medicines.length} prescription medications...`);
  for (const m of medicines) {
    await prisma.medicine.create({
      data: {
        id: m.id,
        userId: user.id,
        name: m.name,
        strength: m.strength || '500 mg',
        form: m.form || 'Tablet',
        manufacturer: m.manufacturer || null,
        dosageInstruction: m.dosageInstruction || '1 tablet after meals',
        dosageInstructionHi: m.dosageInstructionHi || null,
        frequency: m.frequency || 'Once daily',
        timeSlot: m.timeSlot || 'Morning',
        scheduledTime: m.scheduledTime || '08:00 AM',
        startDate: m.startDate || new Date().toISOString().split('T')[0],
        endDate: m.endDate || null,
        status: m.status || 'Upcoming',
        takenAt: m.takenAt || null,
        description: m.description || '',
        descriptionHi: m.descriptionHi || null,
        commonUsesJson: JSON.stringify(m.commonUses || []),
        precautionsJson: JSON.stringify(m.precautions || []),
        sideEffectsJson: JSON.stringify(m.sideEffects || []),
        whenToSeekHelp: m.whenToSeekHelp || '',
        whenToSeekHelpHi: m.whenToSeekHelpHi || null,
      },
    });
  }

  // 6. Seed Family Members
  const familyMembers = data.familyMembers || [];
  console.log(`👨‍👩‍👧 Seeding ${familyMembers.length} caregiver family members...`);
  for (const f of familyMembers) {
    await prisma.familyMember.create({
      data: {
        id: f.id,
        userId: user.id,
        name: f.name,
        relation: f.relation,
        relationHi: f.relationHi || null,
        age: typeof f.age === 'number' ? f.age : 50,
        gender: f.gender || 'Other',
        healthConditionsJson: JSON.stringify(f.healthConditions || []),
      },
    });
  }

  console.log('✅ SQLite Database Seeding Completed Successfully!');
  console.log(`   - 1 User profile created: ${user.name}`);
  console.log(`   - ${reports.length} Reports populated`);
  console.log(`   - ${medicines.length} Medicines populated`);
  console.log(`   - ${familyMembers.length} Family members populated`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed with error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
