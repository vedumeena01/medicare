/**
 * MediExplain AI — FHIR (HL7 Release 4) & Clinical Data Vault Engine
 * Formats longitudinal patient health records into standard interoperable resources.
 */

import { MedicalReport, Medicine, ActiveProfile, UserProfile } from '@/types';

export interface FhirExportOptions {
  profile: ActiveProfile;
  reports: MedicalReport[];
  medicines: Medicine[];
  user?: UserProfile | null;
}

export interface FhirBundle {
  resourceType: 'Bundle';
  id: string;
  meta: {
    lastUpdated: string;
    profile: string[];
  };
  type: 'collection';
  entry: Array<{
    fullUrl: string;
    resource: Record<string, any>;
  }>;
}

/**
 * Builds an HL7 FHIR Release 4 compliant collection bundle.
 */
export function generateFhirBundle(options: FhirExportOptions): FhirBundle {
  const { profile, reports, medicines } = options;
  const timestamp = new Date().toISOString();
  const bundleId = `bundle-ehr-${Date.now()}`;

  const entries: FhirBundle['entry'] = [];

  // 1. Patient Resource
  const patientId = `patient-${profile.id}`;
  entries.push({
    fullUrl: `urn:uuid:${patientId}`,
    resource: {
      resourceType: 'Patient',
      id: patientId,
      active: true,
      name: [
        {
          use: 'official',
          text: profile.name,
        },
      ],
      gender: profile.gender ? profile.gender.toLowerCase() : 'unknown',
      extension: [
        {
          url: 'http://hl7.org/fhir/StructureDefinition/patient-bloodGroup',
          valueString: profile.bloodGroup || 'Unknown',
        },
        {
          url: 'http://hl7.org/fhir/StructureDefinition/patient-approximateAge',
          valueInteger: profile.age || 28,
        },
      ],
      contact: profile.emergencyContact
        ? [
            {
              relationship: [
                {
                  coding: [
                    {
                      system: 'http://terminology.hl7.org/CodeSystem/v2-0131',
                      code: 'C',
                      display: profile.emergencyContact.relation || 'Emergency Contact',
                    },
                  ],
                  text: profile.emergencyContact.relation,
                },
              ],
              name: {
                text: profile.emergencyContact.name,
              },
              telecom: [
                {
                  system: 'phone',
                  value: profile.emergencyContact.phone,
                  use: 'mobile',
                },
              ],
            },
          ]
        : [],
    },
  });

  // 2. AllergyIntolerance Resources
  const allergies = profile.allergies || [];
  allergies.forEach((allergy, index) => {
    entries.push({
      fullUrl: `urn:uuid:allergy-${index + 1}`,
      resource: {
        resourceType: 'AllergyIntolerance',
        id: `allergy-${index + 1}`,
        clinicalStatus: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
              code: 'active',
              display: 'Active',
            },
          ],
        },
        verificationStatus: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification',
              code: 'confirmed',
              display: 'Confirmed',
            },
          ],
        },
        category: ['medication'],
        criticality: allergy.toLowerCase().includes('penicillin') ? 'high' : 'moderate',
        code: {
          text: allergy,
        },
        patient: {
          reference: `urn:uuid:${patientId}`,
          display: profile.name,
        },
        recordedDate: timestamp,
      },
    });
  });

  // 3. Condition Resources (Active Diagnoses)
  const conditions = profile.healthConditions || [];
  conditions.forEach((cond, index) => {
    entries.push({
      fullUrl: `urn:uuid:condition-${index + 1}`,
      resource: {
        resourceType: 'Condition',
        id: `condition-${index + 1}`,
        clinicalStatus: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
              code: 'active',
              display: 'Active',
            },
          ],
        },
        verificationStatus: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status',
              code: 'confirmed',
              display: 'Confirmed',
            },
          ],
        },
        subject: {
          reference: `urn:uuid:${patientId}`,
          display: profile.name,
        },
        code: {
          text: cond,
        },
        recordedDate: timestamp,
      },
    });
  });

  // 4. MedicationStatement Resources
  medicines.forEach((med, index) => {
    entries.push({
      fullUrl: `urn:uuid:medication-${index + 1}`,
      resource: {
        resourceType: 'MedicationStatement',
        id: `medication-${med.id || index + 1}`,
        status: med.status === 'Taken' ? 'completed' : 'active',
        medicationCodeableConcept: {
          text: `${med.name} ${med.strength || ''}`.trim(),
        },
        subject: {
          reference: `urn:uuid:${patientId}`,
          display: profile.name,
        },
        dosage: [
          {
            text: med.dosageInstruction || 'As directed by physician',
            timing: {
              code: {
                text: `${med.frequency} (${med.timeSlot})`,
              },
            },
          },
        ],
        effectiveDateTime: med.startDate || timestamp,
      },
    });
  });

  // 5. Observation Resources (Lab Panels Findings & Abnormalities)
  let observationCount = 0;
  reports.forEach((rep) => {
    const findings = rep.findings || [];
    findings.forEach((finding) => {
      observationCount += 1;
      const interpretationCode =
        finding.status === 'high' ? 'H' : finding.status === 'low' ? 'L' : 'N';

      entries.push({
        fullUrl: `urn:uuid:observation-${observationCount}`,
        resource: {
          resourceType: 'Observation',
          id: `observation-${observationCount}`,
          status: 'final',
          category: [
            {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                  code: 'laboratory',
                  display: 'Laboratory',
                },
              ],
            },
          ],
          code: {
            text: finding.test,
          },
          subject: {
            reference: `urn:uuid:${patientId}`,
            display: profile.name,
          },
          effectiveDateTime: rep.uploadedAt || timestamp,
          valueQuantity: {
            value: parseFloat(finding.value) || finding.value,
            unit: finding.unit,
          },
          referenceRange: [
            {
              text: finding.referenceRange,
            },
          ],
          interpretation: [
            {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
                  code: interpretationCode,
                  display: finding.status.toUpperCase(),
                },
              ],
              text: finding.status,
            },
          ],
          note: [
            {
              text: finding.possibleMeaning || finding.explanation,
            },
          ],
        },
      });
    });
  });

  return {
    resourceType: 'Bundle',
    id: bundleId,
    meta: {
      lastUpdated: timestamp,
      profile: ['http://hl7.org/fhir/StructureDefinition/Bundle'],
    },
    type: 'collection',
    entry: entries,
  };
}

/**
 * Generates an interoperable CSV representation for spreadsheet applications.
 */
export function generateClinicalCsv(options: FhirExportOptions): string {
  const { profile, reports, medicines } = options;
  const rows: string[] = [];

  // CSV Headers
  rows.push(
    [
      'Category',
      'Record Name',
      'Measured / Prescribed Value',
      'Unit / Strength',
      'Reference Range / Frequency',
      'Clinical Interpretation / Instructions',
      'Date Recorded',
    ]
      .map(escapeCsv)
      .join(',')
  );

  // Patient Info Row
  rows.push(
    [
      'Patient Profile',
      profile.name,
      `Age: ${profile.age}, Gender: ${profile.gender}`,
      `Blood Group: ${profile.bloodGroup}`,
      `Allergies: ${profile.allergies?.join('; ') || 'None'}`,
      `Emergency Contact: ${profile.emergencyContact?.name} (${profile.emergencyContact?.phone})`,
      new Date().toLocaleDateString(),
    ]
      .map(escapeCsv)
      .join(',')
  );

  // Medications Rows
  medicines.forEach((med) => {
    rows.push(
      [
        'Prescribed Medication',
        med.name,
        med.strength || 'N/A',
        med.form || 'Tablet',
        med.frequency || 'Daily',
        med.dosageInstruction || 'As directed',
        med.startDate || 'Current',
      ]
        .map(escapeCsv)
        .join(',')
    );
  });

  // Lab Observations Rows
  reports.forEach((rep) => {
    (rep.findings || []).forEach((f) => {
      rows.push(
        [
          `Laboratory Test (${rep.reportType})`,
          f.test,
          f.value,
          f.unit,
          f.referenceRange,
          `${f.status.toUpperCase()}: ${f.possibleMeaning || f.explanation}`,
          rep.uploadedAt || new Date().toLocaleDateString(),
        ]
          .map(escapeCsv)
          .join(',')
      );
    });
  });

  return rows.join('\n');
}

function escapeCsv(str: any): string {
  const val = str === null || str === undefined ? '' : String(str);
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

/**
 * Client helper to trigger browser download of FHIR R4 Bundle
 */
export function downloadFhirBundle(options: FhirExportOptions): void {
  const bundle = generateFhirBundle(options);
  const blob = new Blob([JSON.stringify(bundle, null, 2)], {
    type: 'application/fhir+json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const sanitizedName = options.profile.name.replace(/\s+/g, '_');
  const dateStr = new Date().toISOString().split('T')[0];

  a.href = url;
  a.download = `MediExplain_FHIR_EHR_Vault_${sanitizedName}_${dateStr}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Client helper to trigger browser download of Clinical CSV
 */
export function downloadClinicalCsv(options: FhirExportOptions): void {
  const csv = generateClinicalCsv(options);
  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const sanitizedName = options.profile.name.replace(/\s+/g, '_');
  const dateStr = new Date().toISOString().split('T')[0];

  a.href = url;
  a.download = `MediExplain_Clinical_Summary_${sanitizedName}_${dateStr}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
