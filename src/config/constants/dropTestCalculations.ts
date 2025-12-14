import { Disposition } from "@/config/enums/disposition";
import { DropTestFormInterface } from "@/types";

export const calculateDropTest = (values: DropTestFormInterface) => {
  const sampleSize = values.sampleSize || 0;

  // Calculate All Fire Height
  let allFireHeight = null;
  try {
    for (let i = 16; i >= 1; i--) {
      if (values.numberFired && values?.misfires?.[i] !== null) {
        allFireHeight = i;
        break;
      }
    }
  } catch (error) {
    allFireHeight = null;
  }

  values.allFireHeight = allFireHeight;

  // Calculate No Fire Height
  let noFireHeight = null;
  try {
    // Find the largest height where numberFired <= sampleSize
    for (let i = 1; i <= 16; i++) {
      if (
        values.misfires &&
        values.misfires?.[i] !== null &&
        (values?.misfires?.[i] ?? 0) >= sampleSize
      ) {
        noFireHeight = i;
      }
    }
  } catch (error) {
    noFireHeight = null;
  }

  values.noFireHeight = noFireHeight;

  const misFire = [];
  for (let [key, value] of Object.entries(values.misfires)) {
    misFire[parseInt(key)] = value;
  }

  for (let i = 1; i <= 16; i++) {
    if (values.misfires && (misFire[i] === undefined || misFire[i] === null)) {
      values.numberFired[i] = 0;
      values.percentMisfire[i] = 0;
      values.varianceFactorK[i] = 0;
      values.ptimesK[i] = 0;
      values.skewnessFactorS[i] = 0;
      values.ptimesS[i] = 0;
      continue;
    }

    //Calculate #FR
    if (values.numberFired && misFire[i] !== null) {
      const misfireValue = misFire[i]!;
      const val = sampleSize - misfireValue;
      values.numberFired[i] = val < 0 ? 0 : Math.round(val);
    }
    //Calculate %MF
    if (
      values.percentMisfire &&
      misFire?.[i] !== undefined &&
      misFire?.[i] !== null
    ) {
      const misfireValue = misFire[i]!;
      values.percentMisfire[i] = Math.round((misfireValue / sampleSize) * 100);
    }
    ///Calculate K-FC (Variance Factor K)
    if (values.varianceFactorK && values.percentMisfire) {
      const percentMF = values?.percentMisfire?.[i];

      if (
        percentMF !== null &&
        percentMF !== undefined &&
        percentMF >= 0 &&
        percentMF <= 100
      ) {
        if (percentMF === 100) {
          values.varianceFactorK[i] = 0;
        } else {
          const prevK = i > 1 ? values.varianceFactorK[i - 1] || 0 : 0;
          values.varianceFactorK[i] = prevK === 0 ? 1 : prevK + 2;
        }
      } else {
        values.varianceFactorK[i] = 0;
      }
    }

    //Calculate P*K
    if (values.ptimesK && values.percentMisfire && values.varianceFactorK) {
      const percentMF = values.percentMisfire[i];
      const varianceK = values.varianceFactorK[i];
      if (
        percentMF !== null &&
        percentMF !== undefined &&
        varianceK !== null &&
        varianceK !== undefined
      ) {
        values.ptimesK[i] = percentMF * varianceK;
      }
    }
    //Calculate S-FC (Skewness Factor)
    if (noFireHeight !== null && allFireHeight !== null) {
      const n = i - noFireHeight;
      if (n >= 1 && i <= allFireHeight) {
        const skewnessS = 3 * n ** 2 - 3 * n + 1;
        values.skewnessFactorS[i] = Math.round(skewnessS);
      } else {
        values.skewnessFactorS[i] = 0;
      }
    } else {
      values.skewnessFactorS[i] = 0;
    }

    //Calculate P*S
    if (values.ptimesS && values.percentMisfire && values.skewnessFactorS) {
      const percentMF = values.percentMisfire[i];
      const skewnessS = values.skewnessFactorS[i];
      if (
        percentMF !== null &&
        percentMF !== undefined &&
        skewnessS !== null &&
        skewnessS !== undefined
      ) {
        values.ptimesS[i] = percentMF * skewnessS;
      }
    }
  }

  const percentMisfireSum = Object.values(
    (values?.percentMisfire ?? {}) as Record<string, number | null | undefined>
  ).reduce<number>((acc, val) => acc + (val ?? 0), 0);

  const pTimesKSum = Object.values(
    (values?.ptimesK ?? {}) as Record<string, number | null | undefined>
  ).reduce<number>((acc, val) => acc + (val ?? 0), 0);

  const totalP = (percentMisfireSum - 100) / 100;
  const totalPK = pTimesKSum / 100;

  // Calculate H Bar
  let hBar = null;
  try {
    if (noFireHeight !== null && totalP !== null && totalP !== undefined) {
      hBar = Math.round((noFireHeight + 0.5 + totalP) * 100) / 100;
    }
  } catch (error) {
    hBar = null;
  }

  values.hBar = hBar;

  // Calculate S Dev
  let sDev = null;
  try {
    const variance = totalPK - totalP * totalP;
    if (variance >= 0) {
      sDev = Math.sqrt(variance);
      console.log(sDev);
    }
  } catch (error) {
    console.log(error);
    sDev = null;
  }

  values.sDev = sDev;

  // Calculate H+5S
  let h5S = null;
  try {
    if (hBar !== null && sDev !== null && values.hplusType !== null) {
      h5S = Math.round((hBar + values.hplusType * sDev) * 100) / 100;
    }
  } catch (error) {
    h5S = null;
  }

  values.h5S = h5S;

  // Calculate H-2S
  let h2S = null;
  try {
    if (hBar !== null && sDev !== null && values.hminusType !== null) {
      h2S = Math.round((hBar - values.hminusType * sDev) * 100) / 100;
    }
  } catch (error) {
    h2S = null;
  }

  values.h2S = h2S;

  const testType = values.testType?.trim();
  const isRetest = testType === "Retest";

  const hPlusSpec = isRetest ? values.reTestHplusValue : values.testHplusValue;
  const hMinusSpec = isRetest
    ? values.reTestHminusValue
    : values.testHminusValue;

  // Check if we can evaluate the first condition
  const canEvaluateFirstCondition = 
    h5S !== null &&
    h2S !== null &&
    hPlusSpec !== null &&
    hPlusSpec !== undefined &&
    hMinusSpec !== null &&
    hMinusSpec !== undefined;

  if (!canEvaluateFirstCondition) {
    // Cannot evaluate first condition yet - still In-Progress
    values.disposition = "In-Progress";
    values.dispositionId = Disposition["In-Progress"];
    return values;
  }

  // First condition: H+ S <= H Plus Spec AND H- S >= H Minus Spec
  const firstConditionMet = h5S! <= hPlusSpec! && h2S! >= hMinusSpec!;

  if (!firstConditionMet) {
    // First condition failed - Retest (no need to check second condition)
    values.disposition = "Retest";
    values.dispositionId = Disposition["Retest"];
    return values;
  }

  // First condition passed, now check second condition
  // Second condition: FiringPinMeas >= FiringPinMinSpec (only when FiringPinMinSpec > 0)
  // If FiringPinMinSpec is zero or null, we don't care about this condition
  const firingPinMinSpecValue = values.firingPinMinSpec;
  
  if (firingPinMinSpecValue === null || firingPinMinSpecValue === undefined || firingPinMinSpecValue === 0) {
    // FiringPinMinSpec is zero or null - second condition doesn't apply, Accept based on first condition only
    values.disposition = "Accept";
    values.dispositionId = Disposition["Accept"];
    return values;
  }

  // FiringPinMinSpec > 0, so we must check second condition
  if (values.firingPinMeas === null || values.firingPinMeas === undefined) {
    // FiringPinMinSpec > 0 but FiringPinMeas is not provided - Retest
    values.disposition = "Retest";
    values.dispositionId = Disposition["Retest"];
    return values;
  }

  // Check if FiringPinMeas >= FiringPinMinSpec
  const secondConditionMet = values.firingPinMeas >= firingPinMinSpecValue;

  if (secondConditionMet) {
    // Both conditions met - Accept
    values.disposition = "Accept";
    values.dispositionId = Disposition["Accept"];
  } else {
    // First condition passed but second condition failed - Retest
    values.disposition = "Retest";
    values.dispositionId = Disposition["Retest"];
  }

  return values;
};
