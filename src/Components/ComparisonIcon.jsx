import React from 'react'
import { ArrowUpIcon, ArrowDownIcon, CheckIcon, XIcon } from 'lucide-react'

const ComparisonIcon = ({ comparison }) => {
  switch (comparison) {
    case 'correct':
      return <CheckIcon className="text-green-500" size={16} />
    case 'incorrect':
      return <XIcon className="text-red-500" size={16} />
    case 'higher':
      return <ArrowUpIcon className="text-yellow-500" size={16} />
    case 'mhigher':
      return <ArrowUpIcon className="text-red-500" size={16} />
    case 'lower':
      return <ArrowDownIcon className="text-yellow-500" size={16} />
    case 'mlower':
      return <ArrowDownIcon className="text-red-500" size={16} />
    case 'partial':
      return <div className="text-yellow-500">≈</div>
    default:
      return null
  }
}

export default ComparisonIcon
