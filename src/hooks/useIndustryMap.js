import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setIndustryData, setCurrentIndustry, setIndustries } from '../store/mapSlice';
import { getIndustryTemplate } from '../services/mapService';
import { api } from '../services/api';

export const useIndustryMap = () => {
  const dispatch = useDispatch();
  const currentIndustry = useSelector((s) => s.map.currentIndustry);
  const nodes = useSelector((s) => s.map.nodes);
  const edges = useSelector((s) => s.map.edges);
  const nodeStatuses = useSelector((s) => s.map.nodeStatuses);

  useEffect(() => {
    let mounted = true;

    const loadIndustry = async () => {
      try {
        const data = await api.getIndustry(currentIndustry);
        if (!mounted) return;
        if (data?.nodes?.length) {
          dispatch(setIndustryData({
            nodes: data.nodes,
            edges: data.edges || [],
            svgMarkup: data.svgMarkup || null,
            svgMeta: data.svgMeta || null,
            mapSource: 'api',
          }));
          return;
        }
      } catch {
        // Fall back to local templates
      }

      const template = getIndustryTemplate(currentIndustry);
      if (template && mounted) {
        dispatch(setIndustryData({
          nodes: template.nodes,
          edges: template.edges,
          svgMarkup: null,
          svgMeta: null,
          mapSource: 'preset',
        }));
      }
    };

    loadIndustry();
    return () => {
      mounted = false;
    };
  }, [currentIndustry, dispatch]);

  useEffect(() => {
    let mounted = true;
    const loadIndustries = async () => {
      try {
        const list = await api.getIndustries();
        if (mounted && Array.isArray(list)) {
          dispatch(setIndustries(list));
        } else if (mounted && Array.isArray(list?.industries)) {
          dispatch(setIndustries(list.industries));
        }
      } catch {
        // Ignore and fall back to presets
      }
    };
    loadIndustries();
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  const switchIndustry = (name) => {
    dispatch(setCurrentIndustry(name));
  };

  return { currentIndustry, nodes, edges, nodeStatuses, switchIndustry };
};
