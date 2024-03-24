import * as React from 'react';
import { Container, Typography,List, ListItemButton,ListItemIcon,ListItemText,Collapse  } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Masonry from 'react-masonry-css';
import LuggageIcon from '@mui/icons-material/Luggage';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import SchoolIcon from '@mui/icons-material/School';
import RoofingIcon from '@mui/icons-material/Roofing';
import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid';
import PetsIcon from '@mui/icons-material/Pets';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SmokeFreeIcon from '@mui/icons-material/SmokeFree';
import HealingIcon from '@mui/icons-material/Healing';
import GavelIcon from '@mui/icons-material/Gavel';
import TechnologyIcon from '../images/technology.png';
import ParentingIcon from '../images/parenting.png';
import ExamsIcon from '../images/exams.png';
import FashionIcon from '../images/fashion.png';
import BusinessIcon from '../images/business.png';
import LiteratureIcon from '../images/literature.png';
import SanatanIcon from '../images/sanatan.png';

export default function NestedList() {
  const categories = {
    Travel: ['Solo Travel', 'Family Travel', 'Backpacking', 'General'],
    Food: ['Cooking', 'Quick recipes', 'Vegetarian','Food preservation','Kitchen hacks','Baking','Meal prep','Desserts', 'General'],
    Technology: ['Robotics', 'Quantum Computing', 'Cloud Computing','IOT','AR & VR','AI','Block Chain','VLSI','Web Technologies','Flutter', 'General'],
    Education: ['IT', 'Civil', 'Mechanical', 'Electronics', 'Medical', 'Masters','Ayurvedic Science','Aeronautics','Defence','Management', 'General'],
    Parenting: ['Child care', 'Teen parenting', 'Single parenting', 'General'],
    "Home & Gardening": ['Vegetable','Water plants','Bonsai', 'Herbs','Kitchen Gardening', 'Roof Gardening', 'Succulents','Home Decor','Sustainable living', 'General'],
    "Healthy living": ['Nutrition & Diet', 'Gym', 'Stress Management','Meditation','Yoga', 'General'],
    "Pet care": ['training & behaviour', 'Health & nutrition', 'Grooming tips', 'General'],
    "Competitive exams": ['SAT','CAT','GRE','GMAT','LSAT','ILETS','TOEFL','GATE','UPSC','Banking','JEE','PSUs','SSC', 'General'],
    Finance: ['Money management','Stock investment','retirement planning','Tax Strategies','Passive income streams','crypto currency','Risk management', 'General'],
    Learning: ['Language learning','Math & Science','Home schooling','Communication','Resume Preparation','Arts','Music & Instruments','Dance','Pottery','Martial Arts','Driving','Embroidery','Photography','Digital Art', 'General'],
    Fashion: ['trends & styles','Design & seiving','Personal styling','Sustainable fashion','Wardrobe curation', 'General'],
    Business: ['Startup','Sales techniques','Digital marketing','Branding tactics','Small business','Freelancing', 'General'],
    "Addiction recovery": ['Abuse treatment','Alcoholism recovery','Drug addiction','Behaviourial Addiction','Coping','After care', 'General'],
    Health: ['Mental health','Male health','Female health', 'General'],
    Literature: ['Poetry','Prose','Fiction','Drama', 'General'],
    Law: ['Criminal law','Business law','Civil law','Property & Employment','Environmental laws', 'General'],
    "Sanatan dharm": ['Vedas','Chakras','Epics','Universal laws','Life style & Practices', 'General']
    

  };
  const iconArr = [<LuggageIcon />,<FastfoodIcon />,<img src={TechnologyIcon} alt='TechnologyIcon' height={'28px'} width={'28px'} />,<SchoolIcon />,<img src={ParentingIcon} alt='ParentingIcon' height={'26px'} width={'26px'} />,<RoofingIcon />,<MedicationLiquidIcon />,
  <PetsIcon />,<img src={ExamsIcon} alt='ExamsIcon' height={'26px'} width={'26px'} />,<CurrencyRupeeIcon />,<AutoStoriesIcon />,<img src={FashionIcon} alt='FashionIcon' height={'26px'} width={'26px'} />,<img src={BusinessIcon} alt='BusinessIcon' height={'24px'} width={'24px'} />,<SmokeFreeIcon />,<HealingIcon />,<img src={LiteratureIcon} alt='LiteratureIcon' height={'28px'} width={'28px'} />,<GavelIcon />,<img src={SanatanIcon} alt='SanatanIcon' height={'20px'} width={'20px'} />]
  const catKeys = Object.keys(categories);
 
  const [openStates, setOpenStates] = React.useState({
    Travel: false,
    Food: false,
    Technology: false,
    Education: false,
    Parenting: false,
    Law: false,
    Literature: false,
    Health: false,
    Business: false,
    Learning: false,
    Finance: false,
    Fashion: false,
    "Addiction Recovery": false,
    "Home & Gardening": false,
    "Competitive exams": false,
    "Pet care": false,
    "Healthy living": false

  });

  const handleClick = (item) => {
    setOpenStates({
      ...openStates,
      [item]: !openStates[item],
    });
    
  };

  const breakpoints = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <List
      sx={{ width: '100%'}}
      component="nav"
      subheader={
        <Typography variant='h5' component="div" sx={{paddingTop:'12px',paddingBottom:'12px;'}}>
          Categories
        </Typography>
      }
    >
      <Masonry
        breakpointCols={breakpoints}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {catKeys.map((catName,index) => (
          <Container key={catName}>
            <ListItemButton onClick={() => handleClick(catName)}>
              <ListItemIcon>
                {iconArr[index] }
              </ListItemIcon>
              <ListItemText primary={<Typography fontWeight="bold" fontSize={'18px'}>{catName}</Typography>} />
              {openStates[catName] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openStates[catName]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {categories[catName].map((item, index) => (
                  <ListItemButton href={`/category/${catName}/${item}`} key={index} sx={{ pl: 4 }}>
                      <ListItemIcon>
                        <ArrowForwardIosIcon fontSize='small' />
                      </ListItemIcon>
                      <ListItemText primary={item}/>
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </Container>
        ))}
      </Masonry>
    </List>
  );
}
